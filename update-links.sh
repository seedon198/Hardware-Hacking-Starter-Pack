#!/bin/bash
# Script to update internal documentation links to match the new directory structure

echo "Updating links in documentation files..."

# 1. Foundation section link updates
echo "Updating foundations section links..."
# Update link in 01-introduction.md
sed -i 's|./02-lab-setup.md|./02-lab-setup.md|g' sections/01-foundations/01-introduction.md

# Update link in 02-lab-setup.md
sed -i 's|./03-tools-equipment.md|./03-tools-equipment.md|g' sections/01-foundations/02-lab-setup.md

# Update link in 03-tools-equipment.md
sed -i 's|./04-basic-electronics.md|./04-basic-electronics.md|g' sections/01-foundations/03-tools-equipment.md

# Update link in 04-basic-electronics.md
sed -i 's|../05-communication-protocols.md|../../sections/02-communication-protocols/index.md|g' sections/01-foundations/04-basic-electronics.md

# 2. Communication protocols section link updates
echo "Updating communication protocols section links..."
# Update main index page
sed -i 's|./05a-uart-protocol.md|./wired/01-uart-protocol.md|g' sections/02-communication-protocols/index.md
sed -i 's|./05b-i2c-protocol.md|./wired/02-i2c-protocol.md|g' sections/02-communication-protocols/index.md
sed -i 's|./05c-spi-protocol.md|./wired/03-spi-protocol.md|g' sections/02-communication-protocols/index.md
sed -i 's|./05d-jtag-swd.md|./wired/04-jtag-swd.md|g' sections/02-communication-protocols/index.md
sed -i 's|./05e-usb-protocol.md|./wired/05-usb-protocol.md|g' sections/02-communication-protocols/index.md
sed -i 's|./05f-ethernet-protocols.md|./wired/06-ethernet-protocols.md|g' sections/02-communication-protocols/index.md
sed -i 's|./05g-wireless-protocols.md|./wireless/index.md|g' sections/02-communication-protocols/index.md
sed -i 's|../06-firmware-analysis.md|../../sections/03-firmware/01-firmware-analysis.md|g' sections/02-communication-protocols/index.md

# Update wireless index page
sed -i 's|./05g-01-rf-fundamentals.md|./01-rf-fundamentals.md|g' sections/02-communication-protocols/wireless/index.md
sed -i 's|./05g-02-wifi.md|./02-wifi.md|g' sections/02-communication-protocols/wireless/index.md
sed -i 's|./05g-03-bluetooth.md|./03-bluetooth.md|g' sections/02-communication-protocols/wireless/index.md
sed -i 's|./05g-04-zigbee.md|./04-zigbee.md|g' sections/02-communication-protocols/wireless/index.md
sed -i 's|./05g-05-lora-lpwan.md|./05-lora-lpwan.md|g' sections/02-communication-protocols/wireless/index.md
sed -i 's|./05g-06-rfid-nfc.md|./06-rfid-nfc.md|g' sections/02-communication-protocols/wireless/index.md
sed -i 's|../../06-firmware-analysis.md|../../../sections/03-firmware/01-firmware-analysis.md|g' sections/02-communication-protocols/wireless/index.md

# Update links in wired protocol files
sed -i 's|../05-communication-protocols.md|../index.md|g' sections/02-communication-protocols/wired/*.md
sed -i 's|./05b-i2c-protocol.md|./02-i2c-protocol.md|g' sections/02-communication-protocols/wired/01-uart-protocol.md
sed -i 's|./05c-spi-protocol.md|./03-spi-protocol.md|g' sections/02-communication-protocols/wired/02-i2c-protocol.md
sed -i 's|./05d-jtag-swd.md|./04-jtag-swd.md|g' sections/02-communication-protocols/wired/03-spi-protocol.md
sed -i 's|./05e-usb-protocol.md|./05-usb-protocol.md|g' sections/02-communication-protocols/wired/04-jtag-swd.md
sed -i 's|./05f-ethernet-protocols.md|./06-ethernet-protocols.md|g' sections/02-communication-protocols/wired/05-usb-protocol.md
sed -i 's|./05g-wireless-protocols.md|../wireless/index.md|g' sections/02-communication-protocols/wired/06-ethernet-protocols.md

# Update links in wireless protocol files
sed -i 's|../05g-wireless-protocols.md|./index.md|g' sections/02-communication-protocols/wireless/*.md
sed -i 's|./05g-01-rf-fundamentals.md|./01-rf-fundamentals.md|g' sections/02-communication-protocols/wireless/index.md
sed -i 's|./05g-02-wifi.md|./02-wifi.md|g' sections/02-communication-protocols/wireless/01-rf-fundamentals.md
sed -i 's|./05g-03-bluetooth.md|./03-bluetooth.md|g' sections/02-communication-protocols/wireless/02-wifi.md
sed -i 's|./05g-04-zigbee.md|./04-zigbee.md|g' sections/02-communication-protocols/wireless/03-bluetooth.md
sed -i 's|./05g-05-lora-lpwan.md|./05-lora-lpwan.md|g' sections/02-communication-protocols/wireless/04-zigbee.md
sed -i 's|./05g-06-rfid-nfc.md|./06-rfid-nfc.md|g' sections/02-communication-protocols/wireless/05-lora-lpwan.md
sed -i 's|../../06-firmware-analysis.md|../../../sections/03-firmware/01-firmware-analysis.md|g' sections/02-communication-protocols/wireless/06-rfid-nfc.md

# 3. Update other section links
echo "Updating remaining section links..."

# Firmware analysis links
sed -i 's|../07-attack-vectors.md|../../sections/04-attack-vectors/index.md|g' sections/03-firmware/01-firmware-analysis.md

# Attack vectors links
sed -i 's|./07a-physical-access.md|./01-physical-access.md|g' sections/04-attack-vectors/index.md
sed -i 's|./07b-side-channel.md|./02-side-channel.md|g' sections/04-attack-vectors/index.md
sed -i 's|./07c-fault-injection.md|./03-fault-injection.md|g' sections/04-attack-vectors/index.md
sed -i 's|./07d-hardware-implants.md|./04-hardware-implants.md|g' sections/04-attack-vectors/index.md
sed -i 's|./07e-supply-chain-1.md|./05-supply-chain-1.md|g' sections/04-attack-vectors/index.md
sed -i 's|../08-reverse-engineering.md|../../sections/05-reverse-engineering/index.md|g' sections/04-attack-vectors/index.md

# Update fault injection part 2 link
sed -i 's|./07c-fault-injection-2.md|./03-fault-injection-2.md|g' sections/04-attack-vectors/03-fault-injection.md

# Update supply chain part links
sed -i 's|./07e-supply-chain-2.md|./05-supply-chain-2.md|g' sections/04-attack-vectors/05-supply-chain-1.md
sed -i 's|./07e-supply-chain-3.md|./05-supply-chain-3.md|g' sections/04-attack-vectors/05-supply-chain-2.md
sed -i 's|./08-reverse-engineering.md|../../sections/05-reverse-engineering/index.md|g' sections/04-attack-vectors/05-supply-chain-3.md

# Reverse engineering links
sed -i 's|./08a-re-fundamentals.md|./01-re-fundamentals.md|g' sections/05-reverse-engineering/index.md
sed -i 's|./08b-pcb-analysis.md|./02-pcb-analysis.md|g' sections/05-reverse-engineering/index.md
sed -i 's|./08c-component-id.md|./03-component-id.md|g' sections/05-reverse-engineering/index.md
sed -i 's|./08d-circuit-extraction.md|./04-circuit-extraction.md|g' sections/05-reverse-engineering/index.md
sed -i 's|./08e-advanced-techniques.md|./05-advanced-techniques.md|g' sections/05-reverse-engineering/index.md
sed -i 's|../09-embedded-security.md|../../sections/06-embedded-security/index.md|g' sections/05-reverse-engineering/index.md

# Embedded security links
sed -i 's|./09a-secure-boot.md|./01-secure-boot.md|g' sections/06-embedded-security/index.md
sed -i 's|./09b-memory-protection.md|./02-memory-protection.md|g' sections/06-embedded-security/index.md
sed -i 's|./09c-secure-communications.md|./03-secure-communications.md|g' sections/06-embedded-security/index.md
sed -i 's|./09d-physical-security.md|./04-physical-security.md|g' sections/06-embedded-security/index.md
sed -i 's|./09e-security-testing.md|./05-security-testing.md|g' sections/06-embedded-security/index.md
sed -i 's|../10-mobile-hacking.md|../../sections/07-specialized-domains/01-mobile-hacking.md|g' sections/06-embedded-security/index.md

# Mobile and IoT links
sed -i 's|../11-iot-security.md|./02-iot-security.md|g' sections/07-specialized-domains/01-mobile-hacking.md
sed -i 's|../12-learning-path.md|../../sections/08-professional/01-learning-path.md|g' sections/07-specialized-domains/02-iot-security.md

# Professional development links
sed -i 's|../sections/13-certifications.md|./02-certifications.md|g' sections/08-professional/01-learning-path.md
sed -i 's|../sections/14-community-resources.md|./03-community-resources.md|g' sections/08-professional/02-certifications.md
sed -i 's|./14a-forums-discussions.md|./03a-forums-discussions.md|g' sections/08-professional/03-community-resources.md
sed -i 's|./14b-chat-events.md|./03b-chat-events.md|g' sections/08-professional/03-community-resources.md
sed -i 's|./14c-content-publications.md|./03c-content-publications.md|g' sections/08-professional/03-community-resources.md
sed -i 's|./14d-opensource-tools.md|./03d-opensource-tools.md|g' sections/08-professional/03-community-resources.md
sed -i 's|../15-legal-ethical.md|./04-legal-ethical.md|g' sections/08-professional/03d-opensource-tools.md
sed -i 's|../16-project-ideas.md|./05-project-ideas.md|g' sections/08-professional/04-legal-ethical.md
sed -i 's|../17-glossary.md|./06-glossary.md|g' sections/08-professional/05-project-ideas.md

echo "Link updates completed!"
