package utils

// GetPopularTimezones returns a curated list of 25 GMT-based timezones covering US, EU, Israel, and Asia
func GetPopularTimezones() []string {
	return []string{
		"GMT",
		"Etc/GMT+1",  // GMT-1
		"Etc/GMT+2",  // GMT-2
		"Etc/GMT+3",  // GMT-3
		"Etc/GMT+4",  // GMT-4
		"Etc/GMT+5",  // GMT-5
		"Etc/GMT+6",  // GMT-6
		"Etc/GMT+7",  // GMT-7
		"Etc/GMT+8",  // GMT-8
		"Etc/GMT+9",  // GMT-9
		"Etc/GMT+10", // GMT-10
		"Etc/GMT+11", // GMT-11
		"Etc/GMT+12", // GMT-12
		"Etc/GMT-1",  // GMT+1
		"Etc/GMT-2",  // GMT+2
		"Etc/GMT-3",  // GMT+3
		"Etc/GMT-4",  // GMT+4
		"Etc/GMT-5",  // GMT+5
		"Etc/GMT-6",  // GMT+6
		"Etc/GMT-7",  // GMT+7
		"Etc/GMT-8",  // GMT+8
		"Etc/GMT-9",  // GMT+9
		"Etc/GMT-10", // GMT+10
		"Etc/GMT-11", // GMT+11
		"Etc/GMT-12", // GMT+12
	}
}

// GetTimezoneDisplayName returns a more user-friendly display name for a timezone based on GMT offsets
func GetTimezoneDisplayName(tz string) string {
	switch tz {
	// GMT Base
	case "GMT":
		return "GMT+0 (London, Dublin, Lisbon)"

	// GMT-1 to GMT-12 (West of GMT)
	case "Etc/GMT+1":
		return "GMT-1 (Azores, Cape Verde)"
	case "Etc/GMT+2":
		return "GMT-2 (Mid-Atlantic)"
	case "Etc/GMT+3":
		return "GMT-3 (Brazil, Argentina, Greenland)"
	case "Etc/GMT+4":
		return "GMT-4 (Caribbean, Venezuela)"
	case "Etc/GMT+5":
		return "GMT-5 (US Eastern, Canada, Peru)"
	case "Etc/GMT+6":
		return "GMT-6 (US Central, Mexico, Guatemala)"
	case "Etc/GMT+7":
		return "GMT-7 (US Mountain, Canada)"
	case "Etc/GMT+8":
		return "GMT-8 (US Pacific, Canada, Mexico)"
	case "Etc/GMT+9":
		return "GMT-9 (Alaska, French Polynesia)"
	case "Etc/GMT+10":
		return "GMT-10 (Hawaii, Cook Islands)"
	case "Etc/GMT+11":
		return "GMT-11 (American Samoa, Niue)"
	case "Etc/GMT+12":
		return "GMT-12 (Baker Island, Howland Island)"

	// GMT+1 to GMT+12 (East of GMT)
	case "Etc/GMT-1":
		return "GMT+1 (Central Europe, West Africa)"
	case "Etc/GMT-2":
		return "GMT+2 (Eastern Europe, South Africa, Israel)"
	case "Etc/GMT-3":
		return "GMT+3 (Moscow, East Africa, Middle East)"
	case "Etc/GMT-4":
		return "GMT+4 (UAE, Mauritius, Armenia)"
	case "Etc/GMT-5":
		return "GMT+5 (Pakistan, Uzbekistan, Maldives)"
	case "Etc/GMT-6":
		return "GMT+6 (Bangladesh, Kazakhstan, Bhutan)"
	case "Etc/GMT-7":
		return "GMT+7 (Thailand, Vietnam, Indonesia)"
	case "Etc/GMT-8":
		return "GMT+8 (China, Singapore, Philippines, Malaysia)"
	case "Etc/GMT-9":
		return "GMT+9 (Japan, South Korea, North Korea)"
	case "Etc/GMT-10":
		return "GMT+10 (Australia East, Papua New Guinea)"
	case "Etc/GMT-11":
		return "GMT+11 (Solomon Islands, New Caledonia)"
	case "Etc/GMT-12":
		return "GMT+12 (New Zealand, Fiji, Marshall Islands)"

	default:
		return tz
	}
}
