# Wireless Protocols

Wireless interfaces present unique security challenges and opportunities for hardware hackers. The lack of physical connections makes analysis more complex but also creates possibilities for non-invasive attacks.

## Wireless Communication Fundamentals

### RF Basics for Hardware Hackers

1. **Frequency Bands**
   - Common bands: 2.4GHz, 5GHz, 433MHz, 868/915MHz, 2G/3G/4G/5G cellular
   - Regulatory considerations and restrictions
   - Impact of frequency on range, penetration, and data rate

2. **Modulation Techniques**
   - Amplitude Shift Keying (ASK), Frequency Shift Keying (FSK)
   - Phase Shift Keying (PSK), Quadrature Amplitude Modulation (QAM)
   - Spread Spectrum: DSSS, FHSS, OFDM

3. **Signal Characteristics**
   - Power levels and transmission range
   - Signal-to-noise ratio (SNR) and sensitivity
   - Bandwidth and data rate implications

## Common Wireless Protocols in Embedded Systems

### WiFi (IEEE 802.11)

1. **Hardware Components**
   - WiFi chipsets (Broadcom, Qualcomm/Atheros, Realtek, etc.)
   - Radio front-end and antenna design
   - Host interfaces (SDIO, PCIe, USB)

2. **Security Aspects**
   - Key storage in hardware
   - Access point versus client mode vulnerabilities
   - Protected Management Frames implementation

3. **Common Attack Vectors**
   - Frame injection at hardware level
   - Monitoring mode and promiscuous capture
   - Channel interference and deauthentication

### Bluetooth (IEEE 802.15.1)

1. **Hardware Implementation**
   - Bluetooth controllers and host interfaces
   - Combo chips (Wi-Fi + Bluetooth)
   - Classic Bluetooth vs. Bluetooth Low Energy (BLE) hardware

2. **Security Considerations**
   - Pairing mechanism implementations
   - Link key storage
   - Over-the-air firmware updates

3. **Attack Vectors**
   - Bluetooth sniffing hardware
   - MITM during pairing
   - Firmware vulnerabilities in controllers

### Zigbee and 802.15.4

1. **Hardware Aspects**
   - Common chipsets (Silicon Labs, TI, NXP)
   - Coordinator, router, and endpoint devices
   - SoC vs. network co-processor designs

2. **Security Elements**
   - Key storage mechanisms
   - Network and link key management
   - Trust center implementation

3. **Attack Surface**
   - Network join vulnerabilities
   - Key extraction from hardware
   - Signal jamming and replay attacks

### LoRa and LPWAN

1. **Hardware Architecture**
   - LoRa transceivers (Semtech SX127x series)
   - Gateway versus node hardware
   - Long-range design considerations

2. **Security Implementation**
   - AppKey and AppSKey storage
   - Hardware security elements
   - Join procedures and activation

3. **Vulnerabilities**
   - Key extraction from nodes
   - Replay attacks
   - Signal analysis and message decryption

### RFID and NFC

1. **Hardware Types**
   - LF (125/134 kHz), HF (13.56 MHz), UHF (860-960 MHz)
   - Tag types and reader hardware
   - Antenna design considerations

2. **Security Features**
   - Challenge-response implementations
   - Cryptographic capabilities by tag type
   - Key storage mechanisms

3. **Attack Methods**
   - Reader/tag spoofing
   - Side-channel analysis of authentication
   - Relay attacks

## Hardware Tools for Wireless Hacking

### Software Defined Radio (SDR)

1. **Common SDR Hardware**
   - RTL-SDR (RTL2832U-based)
   - HackRF One
   - YARD Stick One
   - Universal Software Radio Peripheral (USRP)
   - LimeSDR

2. **Capabilities and Limitations**
   - Frequency ranges
   - Bandwidth and sampling rates
   - Transmit capabilities
   - Dynamic range and sensitivity

3. **SDR Setup Example**:
   ```bash
   # Install required software (Ubuntu/Debian)
   sudo apt install gnuradio gqrx-sdr rtl-sdr
   
   # Basic RTL-SDR scanner
   rtl_power -f 433M:434M:1k -g 50 -i 10 -e 1h scan.csv
   
   # Basic signal reception with rtl_fm
   rtl_fm -f 433.92M -s 200k -r 48k | play -r 48k -t raw -e s -b 16 -c 1 -V1 -
   ```

### Protocol-Specific Hardware

1. **Bluetooth Analysis**
   - Ubertooth One
   - Bluetooth sniffers (Ellisys, Frontline)
   - Custom hardware built on development boards

2. **WiFi Hardware**
   - Specialized network adapters with monitor mode
   - Multiple antenna setups for MIMO analysis
   - Packet injection-capable hardware

3. **RFID/NFC Tools**
   - Proxmark3
   - ACR122U and similar readers
   - Custom antenna designs for extended range

4. **Specialized Signal Analysis**
   - Spectrum analyzers
   - Vector network analyzers
   - Near-field probes and antennas

## Wireless Hardware Hacking Techniques

### Signal Capture and Analysis

1. **RF Reconnaissance**
   - Identifying active frequencies
   - Signal characterization
   - Protocol identification
   - Example with rtl_power for spectrum scanning:
     ```bash
     # Scan ISM band and generate heatmap
     rtl_power -f 2400M:2500M:1M -g 50 -i 1 -e 1h wifi_scan.csv
     # Process with heatmap tool
     python heatmap.py wifi_scan.csv wifi_heat.png
     ```

2. **Protocol Reverse Engineering**
   - Capturing signal samples
   - Demodulation and framing analysis
   - Packet structure identification
   - Example GNU Radio flow for ASK/OOK decoding:
     ```python
     # Simple OOK decoder for 433MHz signals
     source = osmosdr.source(args="hackrf=0")
     source.set_sample_rate(2e6)
     source.set_center_freq(433.92e6)
     source.set_gain(40)
     
     # Signal processing blocks
     squelch = analog.simple_squelch_cc(-40, 0.1)
     am_demod = blocks.complex_to_mag_squared()
     threshold = blocks.threshold_ff(0.1, 0.2)
     decoder = digital.clock_recovery_mm_ff(sps, 0.25*0.175*0.175, 0.5, 0.175, 0.005)
     ```

3. **Traffic Interception**
   - Setting up receivers in promiscuous mode
   - Capturing and storing raw signals
   - Decoding protocols in real-time or post-processing

### Wireless Attack Implementation

1. **Replay Attacks**
   - Signal recording and retransmission
   - Timing and synchronization considerations
   - Identifying rolling codes and counters
   - Example with HackRF:
     ```bash
     # Record signal
     hackrf_transfer -r captured_signal.bin -f 433.92e6 -s 2e6 -n 15000000
     
     # Replay signal
     hackrf_transfer -t captured_signal.bin -f 433.92e6 -s 2e6 -a 1 -x 47
     ```

2. **Signal Jamming Techniques**
   - Targeted frequency interference
   - Protocol-aware jamming (e.g., WiFi deauthentication)
   - Selective jamming for MITM setup
   - Example deauthentication with custom hardware:
     ```bash
     # Using aircrack-ng suite
     airmon-ng start wlan0
     aireplay-ng --deauth 0 -a [TARGET_BSSID] wlan0mon
     ```

3. **Hardware-Level Packet Injection**
   - Crafting custom packets
   - Direct access to radio front-end
   - Bypassing driver and operating system restrictions

### Key Extraction from Wireless Hardware

1. **Side-Channel Analysis**
   - Power analysis during cryptographic operations
   - Electromagnetic emissions monitoring
   - Timing analysis of protocol operations

2. **Direct Memory Access**
   - JTAG/debug port access to wireless chipsets
   - Extracting keys from radio controller memory
   - Firmware modification for key disclosure

## Case Studies in Wireless Hardware Hacking

### Case Study: Keyless Entry System Analysis

**Target**: Automotive keyless entry remote

**Process**:
1. Signal capture with SDR during normal operation
2. Demodulation and protocol analysis
3. Identification of encoding and rolling code implementation
4. Assessment of replay and jamming vulnerabilities
5. Analysis of the hardware implementation in the key fob

**Findings**:
- Signal structure and modulation parameters identified
- Rolling code algorithm vulnerabilities discovered
- Hardware design allowed for potential side-channel attacks

### Case Study: WiFi Router Hardware Assessment

**Target**: Consumer WiFi router with WPA2/WPA3

**Process**:
1. Identification of WiFi chipset and architecture
2. Location of debug interfaces on the PCB
3. Extraction of firmware via hardware interfaces
4. Analysis of key storage mechanisms
5. Assessment of hardware-level protections

**Findings**:
- Debug interfaces left enabled in production
- WPA2/3 pre-shared keys stored in readable memory
- Hardware design allowed for flash memory interception

## Wireless Security Recommendations

From a hardware hacker's perspective, understanding these countermeasures helps identify vulnerabilities:

1. **Physical Security**
   - Tamper-evident design for wireless modules
   - Protection of debug interfaces
   - Antenna design to minimize unnecessary radiation

2. **Hardware Security Elements**
   - Secure key storage (eFuses, secure elements)
   - Hardware-accelerated cryptography
   - Isolated security processors

3. **Signal Security**
   - Frequency hopping implementation
   - Signal strength management
   - Jamming resistance techniques

## Practical Exercise: Basic RF Signal Analysis

**Equipment needed**:
- RTL-SDR or similar SDR hardware
- Antenna suitable for target frequency
- Computer with SDR software installed
- Target wireless device (e.g., remote control, IoT device)

**Procedure**:
1. Identify the likely operating frequency of the target device
2. Configure SDR to monitor that frequency range
3. Activate the target device and capture signals
4. Analyze signal characteristics:
   - Modulation type
   - Data encoding
   - Packet structure
   - Timing patterns
5. Attempt to decode the protocol based on observations
6. Document findings and potential security implications

## Conclusion

Wireless protocols add complexity to hardware security assessment but provide unique opportunities for non-invasive analysis. By understanding the hardware implementations of wireless systems, hackers can identify vulnerabilities that might be invisible from a software-only perspective.

The tools and techniques in this section provide a foundation for analyzing wireless systems at the hardware level, from signal capture to protocol analysis and exploitation. As wireless connectivity becomes even more pervasive, these skills will become increasingly valuable for comprehensive security assessment.

---

Now that we've covered the major communication protocols, let's explore how to analyze firmware extracted from hardware devices in the next section: [Firmware Extraction & Analysis](./06-firmware-analysis.md).
