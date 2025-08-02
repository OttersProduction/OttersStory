package ai

import (
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"
)

func TestGetPrice(t *testing.T) {
	// Skip test if no API key is provided
	var err error

	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		t.Skip("Skipping test: OPENAI_API_KEY environment variable not set")
	}

	// Initialize the AI client
	Create(apiKey)

	// Test prompt for Red Craven weapon
	testPrompt := "Neschere 105 wa"

	// Call the GetPrice function
	result, err := GetPrice(testPrompt)

	// Test passes if we get a string response (even if it's an error message)
	if err != nil {
		t.Logf("GetPrice returned an error: %v", err)
		// Even if there's an error, we should have some response
		if result == "" {
			t.Error("Expected a response string, got empty string")
		}
	} else {
		t.Logf("GetPrice returned: %s", result)
		// Verify we got a non-empty response
		if result == "" {
			t.Error("Expected a response string, got empty string")
		}
	}
}

func TestCSVSelection(t *testing.T) {
	// Skip test if no API key is provided
	var err error

	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		t.Skip("Skipping test: OPENAI_API_KEY environment variable not set")
	}

	// Initialize the AI client
	Create(apiKey)

	// Test that CSV selection works for different item types
	testCases := []struct {
		prompt      string
		expectedCSV string
	}{
		{"red craven 55 wa 7 luk", "Sylafia's Price Guide - Thief Gear.csv"},
		{"2h sword 100 wa", "Sylafia's Price Guide - Warrior Gear.csv"},
		{"bow 80 wa", "Sylafia's Price Guide - Archer Gear.csv"},
		{"wand 50 ma", "Sylafia's Price Guide - Int Gear.csv"},
		{"gun 90 wa", "Sylafia's Price Guide - Pirate Gear.csv"},
		{"cape", "Sylafia's Price Guide - Common Gear.csv"},
		{"scroll", "Sylafia's Price Guide - Use Items.csv"},
		{"ore", "Sylafia's Price Guide - Etc Items.csv"},
		{"leech", "Sylafia's Price Guide - Services.csv"},
	}

	for _, tc := range testCases {
		t.Run(tc.prompt, func(t *testing.T) {
			selectedCSV, err := getRelevantCSV(tc.prompt)
			if err != nil {
				t.Errorf("getRelevantCSV failed for prompt '%s': %v", tc.prompt, err)
				return
			}

			t.Logf("Prompt: '%s' -> Selected CSV: '%s'", tc.prompt, selectedCSV)

			// Verify we got a valid CSV selection
			if selectedCSV == "" {
				t.Errorf("Expected a CSV selection for prompt '%s', got empty string", tc.prompt)
			}

			if selectedCSV != tc.expectedCSV {
				t.Errorf("Expected CSV '%s' for prompt '%s', got '%s'", tc.expectedCSV, tc.prompt, selectedCSV)
			}
		})
	}
}
