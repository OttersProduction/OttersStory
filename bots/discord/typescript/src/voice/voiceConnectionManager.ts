import {
  VoiceConnection,
  joinVoiceChannel,
  VoiceConnectionStatus,
  getVoiceConnection,
  VoiceConnectionState,
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  AudioResource,
  StreamType,
} from "@discordjs/voice";
import { Guild, VoiceChannel, GuildMember } from "discord.js";
import { Readable } from "stream";

export class VoiceConnectionManager {
  private connections: Map<string, VoiceConnection> = new Map();
  private leavingChannels: Set<string> = new Set();
  private audioPlayers: Map<string, AudioPlayer> = new Map();

  /**
   * Join a voice channel using @discordjs/voice
   */
  public async joinChannel(
    guild: Guild,
    voiceChannel: VoiceChannel
  ): Promise<VoiceConnection> {
    const guildId = guild.id;
    const channelId = voiceChannel.id;

    // Check if we're already in this channel
    const existingConnection = getVoiceConnection(guildId);
    if (
      existingConnection &&
      existingConnection.joinConfig.channelId === channelId
    ) {
      console.log(`[Voice Manager] Already connected to ${voiceChannel.name}`);
      return existingConnection;
    }

    // Leave current channel if in a different one
    if (existingConnection) {
      await this.leaveChannel(guild);
    }

    // Remove from leaving channels set if present
    this.leavingChannels.delete(channelId);

    try {
      console.log(
        `[Voice Manager] Joining voice channel: ${voiceChannel.name}`
      );

      const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: guild.voiceAdapterCreator,
      });

      // Store the connection
      this.connections.set(guildId, connection);

      // Set up connection event handlers
      this.setupConnectionHandlers(connection, voiceChannel);

      return connection;
    } catch (error) {
      console.error(`[Voice Manager] Error joining voice channel:`, error);
      throw error;
    }
  }

  /**
   * Leave the current voice channel
   */
  public async leaveChannel(guild: Guild): Promise<void> {
    const guildId = guild.id;
    const connection =
      this.connections.get(guildId) || getVoiceConnection(guildId);

    if (!connection) {
      console.log(
        `[Voice Manager] Not connected to any voice channel in guild ${guildId}`
      );
      return;
    }

    const channelId = connection.joinConfig.channelId;

    if (channelId === null) {
      return;
    }
    // Add to leaving channels to prevent loops
    this.leavingChannels.add(channelId);

    try {
      console.log(`[Voice Manager] Leaving voice channel: ${channelId}`);

      connection.destroy();
      this.connections.delete(guildId);

      console.log(
        `[Voice Manager] Successfully left voice channel: ${channelId}`
      );
    } catch (error) {
      console.error(`[Voice Manager] Error leaving voice channel:`, error);
      throw error;
    }
  }

  /**
   * Check if the bot should auto-leave a voice channel
   */
  public shouldAutoLeave(voiceChannel: VoiceChannel): boolean {
    const channelId = voiceChannel.id;

    // Don't auto-leave if we're already in the process of leaving
    if (this.leavingChannels.has(channelId)) {
      return false;
    }

    // Count human members (excluding bots)
    const humanMembers = voiceChannel.members.filter(
      (member) => !member.user.bot
    );

    // Auto-leave if no human members are present
    return humanMembers.size === 0;
  }

  /**
   * Handle voice state updates for auto-leave functionality
   */
  public async handleVoiceStateUpdate(
    oldState: any,
    newState: any
  ): Promise<void> {
    try {
      const guild = newState.guild;
      const guildId = guild.id;

      // Get the bot's voice connection
      const connection =
        this.connections.get(guildId) || getVoiceConnection(guildId);

      if (!connection) {
        return; // Bot is not in any voice channel
      }

      const voiceChannel = newState.guild.members.me?.voice?.channel;

      if (!voiceChannel) {
        return; // Bot is not in a voice channel
      }

      // Check if we should auto-leave
      if (this.shouldAutoLeave(voiceChannel)) {
        console.log(
          `[Voice Manager] Auto-leaving ${voiceChannel.name} - no human members`
        );
        await this.leaveChannel(guild);
      }
    } catch (error) {
      console.error(
        "[Voice Manager] Error handling voice state update:",
        error
      );
    }
  }

  /**
   * Set up connection event handlers
   */
  private setupConnectionHandlers(
    connection: VoiceConnection,
    voiceChannel: VoiceChannel
  ): void {
    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log(`[Voice Manager] Connection ready for ${voiceChannel.name}`);
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      console.log(
        `[Voice Manager] Connection disconnected from ${voiceChannel.name}`
      );
      this.connections.delete(voiceChannel.guild.id);
      this.leavingChannels.delete(voiceChannel.id);
      // Clean up audio player for this guild
      const audioPlayer = this.audioPlayers.get(voiceChannel.guild.id);
      if (audioPlayer) {
        audioPlayer.stop();
        this.audioPlayers.delete(voiceChannel.guild.id);
      }
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
      console.log(
        `[Voice Manager] Connection destroyed for ${voiceChannel.name}`
      );
      this.connections.delete(voiceChannel.guild.id);
      this.leavingChannels.delete(voiceChannel.id);
      // Clean up audio player for this guild
      const audioPlayer = this.audioPlayers.get(voiceChannel.guild.id);
      if (audioPlayer) {
        audioPlayer.stop();
        this.audioPlayers.delete(voiceChannel.guild.id);
      }
    });

    connection.on("error", (error) => {
      console.error(
        `[Voice Manager] Connection error for ${voiceChannel.name}:`,
        error
      );
    });
  }

  /**
   * Get the current voice connection for a guild
   */
  public getConnection(guildId: string): VoiceConnection | undefined {
    return this.connections.get(guildId) || getVoiceConnection(guildId);
  }

  /**
   * Check if the bot is connected to a voice channel in a guild
   */
  public isConnected(guildId: string): boolean {
    const connection = this.getConnection(guildId);
    return (
      connection !== undefined &&
      connection.state.status !== VoiceConnectionStatus.Destroyed
    );
  }

  /**
   * Play a Readable stream in the voice channel
   */
  public async playStream(
    guildId: string,
    stream: Readable,
    options?: {
      inputType?: StreamType;
      inlineVolume?: boolean;
      metadata?: any;
    }
  ): Promise<AudioResource> {
    const connection = this.getConnection(guildId);

    if (!connection) {
      throw new Error(`No voice connection found for guild ${guildId}`);
    }

    // Get or create audio player for this guild
    let audioPlayer = this.audioPlayers.get(guildId);
    if (!audioPlayer) {
      audioPlayer = createAudioPlayer();
      this.audioPlayers.set(guildId, audioPlayer);

      // Subscribe the connection to the audio player
      connection.subscribe(audioPlayer);

      // Set up audio player event handlers
      this.setupAudioPlayerHandlers(audioPlayer, guildId);
    }

    // Create audio resource from the stream
    const resource = createAudioResource(stream, {
      inputType: options?.inputType || StreamType.Arbitrary,
      inlineVolume: options?.inlineVolume || false,
      metadata: options?.metadata,
    });

    // Play the audio resource
    audioPlayer.play(resource);

    return resource;
  }

  /**
   * Stop playing audio in a guild
   */
  public stopAudio(guildId: string): void {
    const audioPlayer = this.audioPlayers.get(guildId);
    if (audioPlayer) {
      audioPlayer.stop();
      console.log(`[Voice Manager] Stopped audio in guild ${guildId}`);
    }
  }

  /**
   * Pause audio playback in a guild
   */
  public pauseAudio(guildId: string): void {
    const audioPlayer = this.audioPlayers.get(guildId);
    if (audioPlayer && audioPlayer.state.status === AudioPlayerStatus.Playing) {
      audioPlayer.pause();
      console.log(`[Voice Manager] Paused audio in guild ${guildId}`);
    }
  }

  /**
   * Resume audio playback in a guild
   */
  public resumeAudio(guildId: string): void {
    const audioPlayer = this.audioPlayers.get(guildId);
    if (audioPlayer && audioPlayer.state.status === AudioPlayerStatus.Paused) {
      audioPlayer.unpause();
      console.log(`[Voice Manager] Resumed audio in guild ${guildId}`);
    }
  }

  /**
   * Get the current audio player status for a guild
   */
  public getAudioPlayerStatus(guildId: string): AudioPlayerStatus | null {
    const audioPlayer = this.audioPlayers.get(guildId);
    return audioPlayer ? audioPlayer.state.status : null;
  }

  /**
   * Set up audio player event handlers
   */
  private setupAudioPlayerHandlers(
    audioPlayer: AudioPlayer,
    guildId: string
  ): void {
    audioPlayer.on(AudioPlayerStatus.Playing, () => {
      console.log(`[Voice Manager] Audio started playing in guild ${guildId}`);
    });

    audioPlayer.on(AudioPlayerStatus.Idle, () => {
      console.log(`[Voice Manager] Audio finished playing in guild ${guildId}`);
    });

    audioPlayer.on(AudioPlayerStatus.Paused, () => {
      console.log(`[Voice Manager] Audio paused in guild ${guildId}`);
    });

    audioPlayer.on(AudioPlayerStatus.Buffering, () => {
      console.log(`[Voice Manager] Audio buffering in guild ${guildId}`);
    });

    audioPlayer.on("error", (error) => {
      console.error(
        `[Voice Manager] Audio player error in guild ${guildId}:`,
        error
      );
    });
  }

  /**
   * Clean up all connections
   */
  public async cleanup(): Promise<void> {
    console.log("[Voice Manager] Cleaning up all voice connections");

    // Clean up audio players
    for (const [guildId, audioPlayer] of this.audioPlayers) {
      try {
        audioPlayer.stop();
      } catch (error) {
        console.error(
          `[Voice Manager] Error stopping audio player for guild ${guildId}:`,
          error
        );
      }
    }

    // Clean up voice connections
    for (const [guildId, connection] of this.connections) {
      try {
        connection.destroy();
      } catch (error) {
        console.error(
          `[Voice Manager] Error destroying connection for guild ${guildId}:`,
          error
        );
      }
    }

    this.connections.clear();
    this.leavingChannels.clear();
    this.audioPlayers.clear();
  }
}
