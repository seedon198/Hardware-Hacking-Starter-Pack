# Hardware Communication Protocols

```
   ┌─────────────────────────────────────────────┐
   │      HARDWARE COMMUNICATION LANDSCAPE       │
   │                                             │
   │      ┌───────────────────────────────┐      │
   │      │        PRIMARY PROCESSOR      │      │
   │      └───────────────┴───────────────┘      │
   │                      │                      │
   │          ───────────╢╢╢───────────          │
   │              BUSES & PROTOCOLS              │
   │          ───────────│ │───────────          │
   │                ┌┴┴┴┴┴┴┴┴┴┴┴┐                │
   │    ┌───────────│           │───────────┐    │
   │    │  SENSORS  │ PROTOCOLS │  MEMORY   │    │
   │    └───────────┘           └───────────┘    │
   │                                             │
   │    ┌────────────────────────────────────┐   │
   │    │  EXTERNAL COMMUNICATION INTERFACES │   │
   │    └────────────────────────────────────┘   │
   │                                             │
   └─────────────────────────────────────────────┘
```

Understanding communication protocols is essential for hardware hackers, serving as the decoder ring to the secret conversations happening inside electronic devices. These protocols govern how components within a system exchange information—defining the electrical signals, timing relationships, data formats, and error handling mechanisms that enable complex functionality. By mastering these digital languages, you gain the power to intercept, analyze, and manipulate the data flows that control device behavior.

## Introduction to Hardware Protocols

At their core, hardware protocols represent standardized methods for digital conversation. Just as human languages follow grammatical rules and conventions, electronic components adhere to protocol specifications that ensure reliable communication despite being manufactured by different companies across the globe. These protocols range from simple serial interfaces found in basic sensors to complex multi-layered standards that handle high-speed data in modern computing systems.

The strategic value of understanding these protocols for hardware security researchers cannot be overstated. Protocol knowledge opens doors to:

1. **Intercepting sensitive information** – By tapping into communication buses, you can capture unencrypted data, credentials, or cryptographic keys that traverse internal connections

2. **Injecting malicious commands** – Once you understand the protocol "grammar," you can craft your own messages that components will interpret as legitimate instructions

3. **Reverse engineering functionality** – Observing command sequences between components reveals insights into device operation that may not be documented

4. **Extracting firmware and secrets** – Many devices expose their entire program memory through debugging protocols intended for development use

5. **Identifying security vulnerabilities** – Protocol implementations often contain weaknesses in authentication, encryption, or message validation that enable attacks

6. **Developing hardware-based attacks** – Combining protocol manipulation with physical access creates powerful exploit vectors that bypass traditional software security measures

This section provides a comprehensive overview of the protocols you'll most frequently encounter during hardware security assessments, offering both theoretical understanding and practical techniques for leveraging these communication channels in your hacking endeavors.

## Table of Contents

For detailed information on each protocol, see the following sub-sections:
- [UART Protocol](./wired/01-uart-protocol.md)
- [I2C Protocol](./wired/02-i2c-protocol.md)
- [SPI Protocol](./wired/03-spi-protocol.md)
- [JTAG and SWD Protocols](./wired/04-jtag-swd.md)
- [USB Protocol](./wired/05-usb-protocol.md)
- [Ethernet and Network Protocols](./wired/06-ethernet-protocols.md)
- [Wireless Protocols](./wireless/index.md)

## Protocol Comparison

Understanding the relative strengths, weaknesses, and characteristics of different protocols helps you quickly identify what you're looking at when analyzing unknown hardware and choose appropriate tools for interception and analysis.

<table>
  <tr>
    <th>Protocol</th>
    <th>Speed</th>
    <th>Wires</th>
    <th>Max Devices</th>
    <th>Distance</th>
    <th>Security Relevance</th>
    <th>Common Usage</th>
  </tr>
  <tr>
    <td>UART</td>
    <td>Low-Medium<br>(9600-3M baud)</td>
    <td>2-3<br>(TX/RX/GND)</td>
    <td>2<br>(point-to-point)</td>
    <td>Short<br>(<15m)</td>
    <td>High - Often provides shell access, boot logs, debug info</td>
    <td>Debug consoles, bootloaders, simple device-to-device links</td>
  </tr>
  <tr>
    <td>I²C</td>
    <td>Low-Medium<br>(100K-5MHz)</td>
    <td>2<br>(SDA/SCL)</td>
    <td>Many<br>(127 addresses)</td>
    <td>Very short<br>(<2m)</td>
    <td>Medium - Configuration, sensor data, EEPROM access</td>
    <td>Sensors, EEPROMs, real-time clocks, multiple slow peripherals</td>
  </tr>
  <tr>
    <td>SPI</td>
    <td>High<br>(10-50MHz+)</td>
    <td>4+<br>(MOSI/MISO/SCK/CS)</td>
    <td>Many<br>(limited by CS lines)</td>
    <td>Very short<br>(<1m)</td>
    <td>High - Firmware storage, cryptographic modules</td>
    <td>Flash memory, display panels, ADCs/DACs, SD cards</td>
  </tr>
  <tr>
    <td>JTAG</td>
    <td>Low-Medium<br>(10-50MHz)</td>
    <td>5+<br>(TDI/TDO/TCK/TMS/RST)</td>
    <td>Multiple<br>(chain)</td>
    <td>Very short<br>(<30cm)</td>
    <td>Critical - Direct memory/register access, debugging</td>
    <td>Processor debugging, boundary scan, firmware loading</td>
  </tr>
  <tr>
    <td>USB</td>
    <td>Very High<br>(1.5M-20G)</td>
    <td>4<br>(VBUS/D+/D-/GND)</td>
    <td>127 per host</td>
    <td>Medium<br>(<5m)</td>
    <td>Medium - Device enumeration can reveal info, DMA attacks</td>
    <td>External peripherals, power delivery, mass storage</td>
  </tr>
  <tr>
    <td>Ethernet</td>
    <td>Very High<br>(10M-10G+)</td>
    <td>4 pairs</td>
    <td>Many<br>(network)</td>
    <td>Long<br>(<100m)</td>
    <td>High - Network traffic, remote access, infrastructure</td>
    <td>Network communication, device control, IoT connectivity</td>
  </tr>
  <tr>
    <td>WiFi</td>
    <td>High<br>(1M-1G+)</td>
    <td>Wireless</td>
    <td>Many<br>(network)</td>
    <td>Medium<br>(<100m)</td>
    <td>High - Packet sniffing, rogue AP attacks, authentication</td>
    <td>Wireless networking, IoT devices, mobile connectivity</td>
  </tr>
  <tr>
    <td>Bluetooth</td>
    <td>Medium<br>(1-3M)</td>
    <td>Wireless</td>
    <td>7 active, 255 parked</td>
    <td>Short<br>(<10-100m)</td>
    <td>Medium - Pairing vulnerabilities, BLE privacy issues</td>
    <td>Personal devices, wearables, audio, IoT controls</td>
  </tr>
</table>

```
┌─────────────────────────────────────────────┐
│        PROTOCOL SELECTION FLOWCHART         │
├─────────────────────────────────────────────┤
│                  START                      │
│                     │                       │
│     ┌───────────────┴───────────────┐       │
│     │ Need debugging or testing?    │       │
│     └───────────────┬───────────────┘       │
│                     │                       │
│                 Yes │ No                    │
│                     │                       │
│         ┌───────────┴───────────┐           │
│         │ JTAG / SWD Available? │           │
│         └───────┬───────────────┘           │
│                 │                           │
│              Yes│No                         │
│                 │                           │
│          Use JTAG/SWD     ┌──────────────┐  │
│                           │ UART for log │  │
│                           │ or CLI debug │  │
│                           └────┬─────────┘  │
│                                │            │
│                         ┌──────┴────────┐   │
│                         │ External conn?│   │
│                         └──────┬────────┘   │
│                                │            │
│                           Yes  │ No         │
│                                │            │
│                   ┌────────────┴──────────┐ │
│                   │ USB / Ethernet needed?│ │
│                   └──────┬──────────┬─────┘ │
│                          │          │       │
│                       USB/Eth    On-board   │
│                                    only     │
│                                     │       │
│                         ┌───────────┴──────┐│
│                         │ Multiple devices?││
│                         └──────┬───────────┘│
│                                │            │
│                       ┌───────────────┐     │
│                       │ Use I2C (slow)│     │
│                       └──────┬────────┘     │
│                              │              │
│                       Need high speed?      │
│                              │              │
│                              Yes            │
│                              │              |
│                      ┌───────┴────────┐     │
│                      │ Use SPI (fast) │     │
│                      └────────────────┘     │
└─────────────────────────────────────────────┘

```

## Protocol Analysis Methodology

Successful protocol analysis follows a structured approach that systematically identifies, captures, and interprets communications within a device. While each protocol has unique characteristics, this general methodology applies across most hardware communication channels.

### 1. Physical Identification

The first step involves locating the physical manifestation of the protocol on the target hardware. Different protocols leave specific traces on printed circuit boards that help identify them:

**Visual Indicators:**
- **UART/Serial:** Look for three or four pins in a row, sometimes labeled TX/RX/GND/VCC
- **I2C:** Search for two data lines (SDA, SCL) with pull-up resistors, often found connecting multiple ICs
- **SPI:** Identify clusters of 4+ connections (MISO, MOSI, SCK, CS) between a controller and one or more peripherals
- **JTAG/SWD:** Find test points or headers with 5-10 pins, often in a 2×5 or 2×10 configuration
- **USB:** Standard connectors (Type-A, Type-B, micro, mini) or differential pair traces

Use continuity testing with a multimeter to trace connections between components when visual inspection isn't sufficient. Signal characteristics measured with an oscilloscope can also help identify unknown protocols by their voltage levels, timing, and signal patterns.

### 2. Connection and Capture

Once identified, appropriate tools must be connected to capture protocol communications:

**Hardware Tools:**
- **Logic Analyzer:** The primary tool for capturing digital protocol traces, with 8+ channels for most embedded protocols
- **Protocol-Specific Adapters:** UART adapters, I2C/SPI bridges, JTAG probes that interface with analysis software
- **Oscilloscope:** For analyzing analog characteristics of digital signals, especially helpful for troubleshooting

**Connection Best Practices:**
- Use thin, flexible test hooks or probes to connect to small test points without causing shorts
- Add series resistors (330-1kΩ) when probing unknown points to protect both the target and your equipment
- Ensure shared ground connections between your tools and the target device
- Consider signal voltage levels, using level shifters when necessary (e.g., 1.8V device with 3.3V logic analyzer)

### 3. Protocol Decoding

Raw captured signals must be interpreted through protocol-specific decoders:

**Software Tools:**
- Logic analyzer software (PulseView, Saleae Logic, etc.) with protocol decoders
- Terminal programs for UART (minicom, PuTTY, screen)
- Specialized protocol analyzers for complex protocols (USB, Ethernet)

When analyzing unknown protocols, start with these steps:
- Determine bit rates and timing patterns
- Identify start/stop conditions and packet boundaries
- Look for repeating patterns in commands/responses
- Compare known actions (e.g., button press) with observed traffic

### 4. Behavioral Analysis

Understanding how the protocol operates within the context of device behavior:

- Map communications to device functions by observing traffic during specific operations
- Identify authentication sequences, commands, and responses
- Document protocol states and transitions
- Create timing diagrams for critical operations

### 5. Intervention and Exploitation

Once the protocol is understood, various intervention techniques can be applied:

- **Passive Monitoring:** Capturing sensitive data without disturbing communications
- **Man-in-the-Middle:** Intercepting and possibly modifying traffic between components
- **Replay Attacks:** Recording legitimate transactions and replaying them
- **Fuzzing:** Sending malformed or unexpected messages to trigger errors
- **Direct Injection:** Bypassing legitimate controllers to send custom commands

The appropriate technique depends on your security research goals, the nature of the protocol, and the specific vulnerabilities you're investigating.

## Practical Exercises

Theoretical knowledge gains substance through hands-on application. The following exercises progress from basic protocol identification to advanced manipulation, each building practical skills essential for hardware security assessment.

### Exercise 1: Protocol Identification

Practice recognizing protocols by physical appearance and signal characteristics.

**Materials:**
- Assorted electronic devices (routers, IoT devices, consumer electronics)
- Multimeter
- Magnifying glass or digital microscope

**Procedure:**
1. Open several devices and photograph their circuit boards
2. Identify potential protocol interfaces using visual indicators
3. Use continuity testing to trace connections between chips
4. Document your findings, noting chip markings near suspected interfaces

### Exercise 2: UART Discovery and Connection

Locate and connect to a UART interface to extract information from a device.

**Materials:**
- Consumer electronic device (router, IP camera, smart device)
- USB-UART adapter
- Logic analyzer or oscilloscope
- Jumper wires

**Procedure:**
1. Identify potential UART pins using visual inspection and continuity testing
2. Use a logic analyzer to determine if the pins show UART activity during boot
3. Determine the baud rate by analyzing signal timing
4. Connect the USB-UART adapter and capture boot messages
5. Document any interesting information revealed (credentials, system paths, etc.)

### Exercise 3: I2C Sniffing and Injection

Intercepting I2C communications and injecting your own commands.

**Materials:**
- Device with I2C communication (e.g., sensor board, EEPROM device)
- Logic analyzer with I2C support
- Microcontroller (Arduino, ESP32, etc.) for command injection
- Jumper wires

**Procedure:**
1. Identify I2C bus on the target device
2. Connect the logic analyzer and capture normal operations
3. Decode the I2C transactions to understand device addresses and commands
4. Use a microcontroller to craft and inject similar commands
5. Document the device's response to legitimate vs. unexpected commands

### Exercise 4: JTAG Boundary Scan

Use JTAG to explore the debug capabilities of a microcontroller.

**Materials:**
- Development board with JTAG interface
- JTAG adapter (J-Link, Bus Pirate, etc.)
- OpenOCD or similar JTAG software

**Procedure:**
1. Identify and connect to the JTAG interface
2. Use OpenOCD to detect the devices in the JTAG chain
3. Perform a boundary scan to identify accessible pins
4. Read from memory addresses to extract firmware or configuration
5. Document the security implications of the accessible debug features

Each of these exercises should be performed on hardware you legally own or have explicit permission to test. Document your findings thoroughly, as the insights gained will be valuable reference material for future hardware hacking projects.

---

## Navigation

**Section: Communication Protocols**

* Previous: [README](../../README.md)
* Next: [Wired Protocols - UART](./wired/01-uart-protocol.md)
* Next: [Wireless Protocols](./wireless/index.md)
* [Back to Main Index](../../README.md)
