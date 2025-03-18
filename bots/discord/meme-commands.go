package main

import (
	"fmt"
	_ "time/tzdata"

	"github.com/bwmarrin/discordgo"
)

func SmickCommand(s *discordgo.Session, i *discordgo.InteractionCreate) {

	options := i.ApplicationCommandData().Options
	smickedUser := options[0].UserValue(s)

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: fmt.Sprintf("OMG <@%s> just smicked <@%s>, such savage what will be done????", i.Interaction.User.ID, smickedUser.ID),
		},
	})

}
