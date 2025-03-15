package main

import (
	"flag"
	"log"
	"os"
	"os/signal"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/joho/godotenv"
)

var s *discordgo.Session
var SuggestionChannel *string
var GuildID *string
var PCPricesChannel *string

func init() { flag.Parse() }

func init() {
	var err error

	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	BotToken := os.Getenv("DISCORD_TOKEN")

	s, err = discordgo.New("Bot " + BotToken)
	if err != nil {
		log.Fatalf("Invalid bot parameters: %v", err)
	}

}

var (
	commands = []*discordgo.ApplicationCommand{
		{
			Name:        "opq-guide",
			Description: "Guide to Orbis pq",
		},
		{
			Name:        "ht-pt",
			Description: "Arrange a party to kill horntail",
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "date",
					Description: "Date of the party assembly (DD/MM HH:MM) UTC/Server time",
					Required:    true,
				},
			},
		},
		{
			Name:        "suggest",
			Description: "Suggest a new feature or report a bug",
		},
		{
			Name:        "pc",
			Description: "Get the price of a item",
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "prompt",
					Description: "Prompt to get the price of a item",
					Required:    true,
				},
			},
		},
		{
			Name:        "verify",
			Description: "Verify your ign and timezone",
		},
		{
			Name:        "time",
			Description: "Get user current time",
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionUser,
					Name:        "user",
					Description: "User to show its current time",
					Required:    false,
				},
			},
		},
	}

	commandHandlers = map[string]func(s *discordgo.Session, i *discordgo.InteractionCreate){
		"opq-guide": OPQ_GuideCommand,
		"ht-pt":     HT_PartyCommand,
		"suggest":   SuggestionCommand,
		"pc":        PC_Command,
		"verify":    VerifyCommand,
		"time":      TimeCommand,
	}
)

func init() {

	s.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		switch i.Type {
		case discordgo.InteractionApplicationCommand:
			if h, ok := commandHandlers[i.ApplicationCommandData().Name]; ok {
				h(s, i)
			}
		case discordgo.InteractionModalSubmit:
			data := i.ModalSubmitData()

			if strings.HasPrefix(data.CustomID, "modals_suggestion") {
				err := HandleModalSuggestion(s, i)
				if err != nil {
					log.Printf("Error handling modal suggestion: %v", err)
				}
			}

			if strings.HasPrefix(data.CustomID, "modals_verify") {
				err := HandleModalVerify(s, i)
				if err != nil {
					log.Printf("Error handling modal verify: %v", err)
				}
			}
		}
	})

}

func main() {

	s.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		log.Printf("Logged in as: %v#%v", s.State.User.Username, s.State.User.Discriminator)
	})

	err := s.Open()

	if err != nil {
		log.Fatalf("Cannot open the session: %v", err)
	}

	GuildID = &s.State.Guilds[0].ID
	channels, err := s.GuildChannels(*GuildID)
	if err != nil {
		log.Fatalf("Error getting guild channels: %v", err)
	}

	for _, channel := range channels {
		if channel.Name == "suggestions" {
			SuggestionChannel = &channel.ID
		}
		if channel.Name == "💰trade-pc" {
			PCPricesChannel = &channel.ID
		}
	}

	if SuggestionChannel == nil {
		log.Fatalf("Suggestions channel not found")
	}

	log.Println("Adding commands...")
	for _, v := range commands {
		_, err := s.ApplicationCommandCreate(s.State.User.ID, *GuildID, v)
		if err != nil {
			log.Panicf("Cannot create '%v' command: %v", v.Name, err)
		}
	}

	defer s.Close()
	defer db.Close()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	log.Println("Press Ctrl+C to exit")
	<-stop

	log.Println("Removing commands...")

	registeredCommands, err := s.ApplicationCommands(s.State.User.ID, *GuildID)
	if err != nil {
		log.Panicf("Cannot get registered commands: %v", err)
	}

	for _, v := range registeredCommands {
		err := s.ApplicationCommandDelete(s.State.User.ID, *GuildID, v.ID)
		if err != nil {
			log.Panicf("Cannot delete '%v' command: %v", v.Name, err)
		}
		log.Printf("Deleted '%v' command", v.Name)
	}

	log.Println("Gracefully shutting down.")
}
