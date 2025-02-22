package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/bwmarrin/discordgo"
)

func SuggestionCommand(s *discordgo.Session, i *discordgo.InteractionCreate) {

	err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseModal,
		Data: &discordgo.InteractionResponseData{
			CustomID: "modals_suggestion_" + i.Interaction.Member.User.ID,
			Title:    "Suggestion",
			Components: []discordgo.MessageComponent{
				discordgo.ActionsRow{
					Components: []discordgo.MessageComponent{
						discordgo.TextInput{
							CustomID:    "title",
							Label:       "Title",
							Style:       discordgo.TextInputShort,
							Placeholder: "Find Base a wife",
							Required:    true,
							MaxLength:   50,
							MinLength:   5,
						},
					},
				},
				discordgo.ActionsRow{
					Components: []discordgo.MessageComponent{
						discordgo.TextInput{
							CustomID:  "description",
							Label:     "Description",
							Style:     discordgo.TextInputParagraph,
							Required:  true,
							MaxLength: 2000,
						},
					},
				},
			},
		},
	})

	if err != nil {
		log.Printf("Error sending modal: %v", err)
	}
}

func HandleModalSuggestion(s *discordgo.Session, i *discordgo.InteractionCreate) error {

	err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: "Thank you for taking your time to fill this suggestion",
			Flags:   discordgo.MessageFlagsEphemeral,
		},
	})
	if err != nil {
		panic(err)
	}

	data := i.ModalSubmitData()
	title := data.Components[0].(*discordgo.ActionsRow).Components[0].(*discordgo.TextInput).Value
	description := data.Components[1].(*discordgo.ActionsRow).Components[0].(*discordgo.TextInput).Value
	userid := strings.Split(data.CustomID, "_")[2]
	_, err = s.ChannelMessageSend(*SuggestionChannel, fmt.Sprintf(
		`**Suggestion: %s**
		Author: <@%s>
		Description: %s`,
		title,
		userid,
		description,
	))

	return err

}

func PC_Command(s *discordgo.Session, i *discordgo.InteractionCreate) {

	options := i.ApplicationCommandData().Options
	prompt := options[0].StringValue()
	respond, err := GetPrice(prompt)

	if err != nil {
		log.Printf("Error getting price: %v", err)
		return
	}

	_, err = s.ChannelMessageSend(*PCPricesChannel, respond)

	if err != nil {
		log.Printf("Error sending message: %v", err)
	}

}
