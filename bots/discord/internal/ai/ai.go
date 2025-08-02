package ai

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/sashabaranov/go-openai"
)

var client *openai.Client
var ctx context.Context

func Create(apiKey string) {
	ctx = context.Background()

	// Configure client to use OpenRouter API
	config := openai.DefaultConfig(apiKey)
	config.BaseURL = "https://openrouter.ai/api/v1"
	client = openai.NewClientWithConfig(config)
}

// getRelevantCSV uses AI to determine which CSV file is most relevant to the prompt
func getRelevantCSV(prompt string) (string, error) {
	// Available CSV files
	csvFiles := []string{
		"Sylafia's Price Guide - Warrior Gear.csv",
		"Sylafia's Price Guide - Archer Gear.csv",
		"Sylafia's Price Guide - Thief Gear.csv",
		"Sylafia's Price Guide - Int Gear.csv",
		"Sylafia's Price Guide - Pirate Gear.csv",
		"Sylafia's Price Guide - Common Gear.csv",
		"Sylafia's Price Guide - Use Items.csv",
		"Sylafia's Price Guide - Etc Items.csv",
		"Sylafia's Price Guide - Services.csv",
	}

	// Create a prompt for the AI to select the best CSV
	selectionPrompt := fmt.Sprintf(`You are a MapleStory private server price guide assistant. Based on the user's question, select the most relevant price guide CSV file from the following options:

Available CSV files:
1. "Sylafia's Price Guide - Warrior Gear.csv" - Contains warrior weapons (swords, axes, blunt weapons, spears, polearms)
2. "Sylafia's Price Guide - Archer Gear.csv" - Contains archer weapons (bows, crossbows, arrows)
3. "Sylafia's Price Guide - Thief Gear.csv" - Contains thief weapons (daggers, claws, throwing stars)
4. "Sylafia's Price Guide - Int Gear.csv" - Contains mage weapons (wands, staffs) and mage equipment
5. "Sylafia's Price Guide - Pirate Gear.csv" - Contains pirate weapons (guns, knucklers, bullets)
6. "Sylafia's Price Guide - Common Gear.csv" - Contains common equipment (capes, gloves, shoes, face accessories, eye accessories, earrings, rings, belts, overalls)
7. "Sylafia's Price Guide - Use Items.csv" - Contains scrolls, potions, elixirs, mastery books, consumables
8. "Sylafia's Price Guide - Etc Items.csv" - Contains materials, ores, crystals, quest items, crafting materials
9. "Sylafia's Price Guide - Services.csv" - Contains leech services, boss runs, skillbooks, helms

Available resources:
- https://bc.hidden-street.net/
- https://royals.wiki/
- https://royals-library.netlify.app/

Always use the resources to help you answer the question.

User Question: %s

Respond with ONLY the exact filename of the most relevant CSV file. If multiple files could be relevant, choose the one that would contain the primary item being asked about. If the question is about general equipment or accessories, default to "Sylafia's Price Guide - Common Gear.csv".`, prompt)

	// Ask AI to select the best CSV
	resp, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: "openai/gpt-4o-mini",
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleUser,
				Content: selectionPrompt,
			},
		},
	})

	if err != nil {
		return "", fmt.Errorf("failed to get CSV selection from AI: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no response received from AI for CSV selection")
	}

	selectedCSV := strings.TrimSpace(resp.Choices[0].Message.Content)

	// Validate that the selected CSV exists in our list
	for _, csvFile := range csvFiles {
		if csvFile == selectedCSV {
			return selectedCSV, nil
		}
	}

	// If AI returned something unexpected, default to Common Gear
	return "Sylafia's Price Guide - Common Gear.csv", nil
}

// readCSVFile reads the CSV file content
func readCSVFile(filename string) (string, error) {
	// Construct the full path to the CSV file
	fullPath := filepath.Join("data", filename)

	content, err := os.ReadFile(fullPath)
	if err != nil {
		return "", fmt.Errorf("failed to read CSV file %s: %w", filename, err)
	}

	return string(content), nil
}

func GetPrice(prompt string) (string, error) {
	// Determine which CSV file to include using AI
	csvFile, err := getRelevantCSV(prompt)
	if err != nil {
		return "", fmt.Errorf("failed to determine relevant CSV: %w", err)
	}

	// Read the CSV content
	csvContent, err := readCSVFile(csvFile)
	if err != nil {
		return "", fmt.Errorf("failed to read CSV content: %w", err)
	}

	// Create enhanced prompt with CSV data
	enhancedPrompt := fmt.Sprintf(`%s
	
	%s`, csvContent, prompt)

	// Create chat completion request using OpenRouter
	resp, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: "@preset/otteria", // You can change this to any model supported by OpenRouter
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleUser,
				Content: enhancedPrompt,
			},
		},
	})

	if err != nil {
		return "", fmt.Errorf("failed to create chat completion: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no response received from AI")
	}

	return resp.Choices[0].Message.Content, nil
}
