package main

import (
	"fmt"
	"log"
	"time"

	"github.com/bwmarrin/discordgo"
)

func HT_PartyCommand(s *discordgo.Session, i *discordgo.InteractionCreate) {

	options := i.ApplicationCommandData().Options
	input := options[0].StringValue()
	startTime, err := DateFromDayMonth(input)
	endingTime := startTime.Add(2 * time.Hour)

	if err != nil {
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "Invalid date :(",
			},
		})
		return
	}

	scheduledEvent, err := s.GuildScheduledEventCreate(i.GuildID, &discordgo.GuildScheduledEventParams{
		Name: "Horntail Run",
		Description: `
Members needed: 6 minimum, no max
	
React with the following for your **role**:
> Attacker :crossed_swords:
> Seduce Target :face_with_spiral_eyes:
> SI / Bucc :pirate_flag:
> SE / Archer :bow_and_arrow:
> CR / Pally :shield:
> HS / Bishop :pray_tone4:

**Ready Checklist**
> All cure potions :milk:
> HP/MP Potions :cheese:
> 6 Onyx Apples :apple:
> Dragon Elixirs :dragon_face:`,
		ScheduledStartTime: &startTime,
		ScheduledEndTime:   &endingTime,
		EntityType:         discordgo.GuildScheduledEventEntityTypeExternal,
		PrivacyLevel:       discordgo.GuildScheduledEventPrivacyLevelGuildOnly,
		EntityMetadata: &discordgo.GuildScheduledEventEntityMetadata{
			Location: "Horntail Cave",
		},
	})
	if err != nil {
		log.Printf("Error creating scheduled event: %v", err)
		return
	}

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: fmt.Sprintf("Scheduled event created <3: %s at %s", scheduledEvent.Name, startTime.UTC().Format("2/1 15:04")),
		},
	})

}
