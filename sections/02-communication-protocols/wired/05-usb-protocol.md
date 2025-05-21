# USB: The Universal Gateway to Device Hacking

```
    COMPUTER                          DEVICE
┌─────────────┐                  ┌─────────────┐
│             │                  │             │
│             │      USB         │             │
│    HOST     ├──────────────────┤   TARGET    │
│  CONTROLLER │◄──── DATA ─────►│    DEVICE   │
│             │                  │             │
│             │   POWER & GND    │             │
└─────┬───────┘──────────────────└─────────────┘
      │
      └─── OTHER USB DEVICES
```

In the vast landscape of hardware hacking, few interfaces offer as much opportunity as Universal Serial Bus (USB). This ubiquitous connection technology has become the de facto standard for connecting peripherals to computers - from keyboards and mice to complex medical equipment and industrial controllers. For hardware hackers, USB represents a tantalizing attack surface: it's externally accessible, complex enough to harbor vulnerabilities, and powerful enough to provide significant system access when exploited.

The beauty of USB from a security research perspective lies in its contradiction: designed to be universally compatible and user-friendly, yet implementing a complex protocol stack that has repeatedly proven challenging to secure. This combination makes USB one of the most fruitful targets for hardware security assessment and exploitation.

## Decoding USB: The Language of Modern Device Communication

Before diving into how to attack USB interfaces, we need to understand the foundations of how this nearly universal technology actually works. The key to successful hardware hacking often lies in deeply understanding the underlying protocols - and USB is no exception.

### USB Architecture: Built for Universal Connectivity

```
┌─────────────────────────────────────────────────┐
│  USB SYSTEM ARCHITECTURE                        │
├─────────────────────┬──────────────────────────┤
│                       │                          │
│       HOST            │      DEVICE              │
│                       │                          │
│  ┌─────────────────┐  │  ┌─────────────────┐     │
│  │ Application    │  │  │ Application    │     │
│  └─────────────────┘  │  └─────────────────┘     │
│  ┌─────────────────┐  │  ┌─────────────────┐     │
│  │ USB System    │  │  │ USB System    │     │
│  └─────────────────┘  │  └─────────────────┘     │
│  ┌─────────────────┐  │  ┌─────────────────┐     │
│  │ USB Bus IF    │  │  │ USB Bus IF    │     │
│  └─────────────────┘  │  └─────────────────┘     │
│                       │                          │
│       D+/D-/VBUS      │                          │
│    ──────────────────────────────────────────    │
└─────────────────────────────────────────────────┘
```

USB's architecture is elegantly designed for flexibility and simplicity - which ironically creates complexity in its implementation. At its core, USB employs a strict **host-device model** that shapes everything about how the protocol functions. Unlike peer-to-peer protocols, USB enforces a clear hierarchy: one central host controller orchestrates all communication with potentially dozens of connected peripheral devices. This asymmetric power dynamic means the host initiates all transactions - devices can't spontaneously send data without being polled by the host.

The protocol itself is structured in well-defined **layers** (similar to networking protocols):

* **Physical Layer**: Handles the electrical specifications, signaling, and timing
* **Data Link Layer**: Manages packet framing, addressing, and error checking
* **Protocol Layer**: Implements the transaction types and device enumeration
* **Application Layer**: Provides the interface for specific device functionality

One of USB's most practical features is its support for **multiple speed grades**, each backward compatible with previous generations but offering increasingly higher bandwidth:

* **Low Speed (1.5 Mbps)**: For basic peripherals like keyboards and mice
* **Full Speed (12 Mbps)**: For audio devices and low-resolution webcams
* **High Speed (480 Mbps)**: Introduced in USB 2.0 for storage and video
* **SuperSpeed (5+ Gbps)**: USB 3.0 and beyond for high-bandwidth applications

Beyond data transfer, USB is revolutionary for its **integrated power delivery** capability, eliminating the need for separate power cables for most peripherals. This power aspect has evolved from providing a basic 500mA at 5V in early implementations to today's USB Power Delivery standard supporting up to 240W for charging laptops and other high-power devices.

Another user-friendly feature that creates security implications is USB's **hot-pluggable design** - devices can be connected or disconnected while the system is running. This convenience requires complex enumeration procedures where the host must detect, identify, and configure devices on the fly, creating potential attack vectors during these transitional states.

### USB Signal Lines: The Physical Layer Exposed

```
      USB 2.0 CONNECTOR               USB 3.0 CONNECTOR
      ┌───────────┐               ┌───────────┐
      │ ●●●●       │               │ ●●●●●●●●● │
      │           │               │           │
      └───────────┘               └───────────┘
          │ │ │ │                  │ │ │ │ │ │ │ │ │
          ↓ ↓ ↓ ↓                  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
     VBUS D- D+ GND              VBUS D- D+ GND SSTX+ SSTX- SSRX+ SSRX- GND
     (Red)(White)(Green)(Black)  (Red)(White)(Green)(Black)...Additional...
```

At the physical layer, USB connections rely on a surprisingly small number of essential signal lines. Understanding these signals is critical for hardware hackers who might need to intercept, monitor, or manipulate USB communication.

The original USB design (versions 1.x and 2.0) utilizes just four connections:

* **D+ and D- (Data Lines)**: These form a differential pair carrying data in both directions. The differential signaling provides noise immunity while the specific voltage states and transitions encode the USB protocol. For hardware hackers, these are the primary lines to monitor when analyzing USB traffic. When idle, one line is pulled high (typically D+) to indicate the device speed capability.

* **VBUS (Voltage Bus)**: The power line providing a nominal +5V from the host to powered devices. This line can deliver varying current depending on the USB specification (from 100mA in early USB to significantly higher values with USB Power Delivery). For hackers, VBUS can sometimes be manipulated to perform power glitching attacks or to exploit power transition states.

* **GND (Ground)**: The common reference point for all signals. While often overlooked, a proper ground connection is essential for reliable signal analysis.

USB 3.0 and later versions maintain backward compatibility while adding several additional signal lines to achieve much higher data rates:

* **SSTX+/- (SuperSpeed Transmitter)**: Differential pair for SuperSpeed data transmission
* **SSRX+/- (SuperSpeed Receiver)**: Differential pair for SuperSpeed data reception
* **Additional ground lines**: For signal integrity at higher frequencies

The physical arrangement of these pins in different USB connectors (Type-A, Type-B, Type-C, Micro, Mini, etc.) varies, but the core signaling principles remain consistent. From a hardware hacking perspective, identifying and accessing these signals is often the first step in analyzing or intercepting USB communications.

When working with USB, hardware hackers often use breakout boards or custom cables to expose these signals for monitoring or manipulation. Specialized hardware tools like USB protocol analyzers can tap into these lines, decoding the electrical signals into the higher-level protocols they represent.

### USB Communication Model: The Protocol's Heartbeat

```
┌─────────────────────────────────────────────────┐
│                                                │
│  1. ENUMERATION         2. ENDPOINT SETUP      │
│  ┌─────────────┐     ┌─────────────┐      │
│  │ Device Reset  │     │ Create Logical │      │
│  │ Get Device ID │     │ Communication  │      │
│  │ Get Descriptors│     │ Channels      │      │
│  │ Configuration  │     └─────────────┘      │
│  └─────────────┘                       │
│                                                │
│  3. DATA TRANSFERS      4. DEVICE INFO         │
│  ┌─────────────┐     ┌─────────────┐      │
│  │ Control      │     │ Device       │      │
│  │ Bulk         │     │ Configuration │      │
│  │ Interrupt     │     │ Interface     │      │
│  │ Isochronous  │     │ Endpoint      │      │
│  └─────────────┘     └─────────────┘      │
│                                                │
└─────────────────────────────────────────────────┘
```

Understanding how USB devices communicate is essential for hardware hackers. The USB communication model follows a structured approach that creates numerous opportunities for analysis and potential exploitation.

#### Enumeration: The Digital Handshake

The moment you plug in a USB device, a complex dance begins. This process, called enumeration, is where many security vulnerabilities can lurk:

1. The host detects the physical connection and provides power to the device
2. The host resets the device by driving the data lines to a specific state
3. The device responds, indicating its speed capability (low/full/high/super)
4. The host assigns a unique address to the device (it starts with the default address 0)
5. The host requests descriptors from the device - essentially asking "what are you?"
6. Based on the descriptors, the host loads appropriate drivers
7. The host configures the device for operation

For hardware hackers, this enumeration phase is rich with opportunity - malicious devices can present false information, and legitimate devices might expose sensitive data during this process.

#### Endpoints: The Communication Channels

USB devices organize communication through logical channels called endpoints. Think of endpoints as mailboxes - each with a specific purpose and direction:

* **Endpoint 0**: Every USB device must have this - it's the control endpoint used for setup and management
* **Other Endpoints**: Defined by the device for specific functions (e.g., one for sending keyboard input, another for receiving LED status)

Each endpoint has a direction (IN to host or OUT from host) and specific handling characteristics. By analyzing endpoint configurations, hackers can identify the purpose of each communication channel and focus on those most relevant to their security assessment.

#### Transfer Types: Different Ways to Move Data

USB supports four distinct transfer types, each optimized for different purposes:

* **Control Transfers**: Used for command and status operations (mandatory for all devices)
* **Bulk Transfers**: Large, non-time-critical data (like file transfers to storage devices)
* **Interrupt Transfers**: Small, bounded-latency data (like mouse movements or keyboard input)
* **Isochronous Transfers**: Real-time, continuous streams (audio/video) that can tolerate some data loss

From a security perspective, each transfer type presents different attack opportunities. Interrupt transfers carrying keystroke data might be intercepted to capture passwords, while manipulating control transfers could potentially change a device's configuration.

#### Descriptors: The Device's Identity Card

USB devices identify themselves and their capabilities through a hierarchical set of descriptors:

* **Device Descriptor**: One per device, containing basic information like vendor/product IDs
* **Configuration Descriptor**: Describes power requirements and available configurations
* **Interface Descriptor**: Defines a functional group of endpoints (a device may have multiple interfaces)
* **Endpoint Descriptor**: Specifies properties of each communication endpoint

These descriptors are often the first target for hardware hackers, as they reveal the device's identity, capabilities, and communication structure. Manipulating descriptors can be a powerful technique for USB spoofing attacks, allowing a malicious device to masquerade as something else.

## USB Hacking Methodology: The Art of Device Exploitation

```
      ┌────────────┐        ┌────────────┐       ┌────────────┐
      │            │        │            │       │            │
      │ RECONNAISSANCE│ ───► │  ANALYSIS   │ ───► │ EXPLOITATION │
      │            │        │            │       │            │
      └────────────┘        └────────────┘       └────────────┘
       │                  │                  │
       ↓                  ↓                  ↓
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Identify     │    │ Protocol     │    │ Craft        │
│ Devices      │    │ Reverse      │    │ Custom       │
│ Interfaces   │    │ Engineering  │    │ Attacks      │
│ Descriptors  │    │ Traffic      │    │ Manipulate   │
└─────────────┘    └─────────────┘    └─────────────┘
```

Successful USB hacking follows a methodical approach that begins with understanding the target and progressively moves toward exploitation. Like any security assessment, the process requires patience, careful documentation, and a logical progression from information gathering to exploitation.

### USB Reconnaissance: Know Your Target

The first phase of USB hacking involves gathering detailed information about the target device. This reconnaissance stage is critical - the more you understand about the device's identity, capabilities, and communication patterns, the more effectively you can analyze and potentially exploit it.

#### Device Identification: Who Are You?

Every USB device has a digital identity comprised of several key elements:

* **Vendor and Product IDs (VID/PID)**: These unique identifiers (each 16 bits) reveal the manufacturer and specific product model. For example, a VID of 0x046D identifies Logitech, while the PID specifies the exact device model. These IDs are crucial because they determine which driver the host system loads.

* **Device Class**: USB devices identify their general functionality through standardized class codes (e.g., 0x03 for Human Interface Devices like keyboards, 0x08 for Mass Storage). Some devices use class code 0xFF (vendor-specific), indicating proprietary protocols that may require more in-depth analysis.

* **Capabilities and Configurations**: Devices advertise their features, power requirements, and supported transfer types through descriptors.

To gather this information, hardware hackers rely on several tools:

```bash
# Linux basic USB device enumeration
$ lsusb
Bus 001 Device 005: ID 046d:c52b Logitech, Inc. Unifying Receiver

# For more detailed information
$ lsusb -v -d 046d:c52b

# Windows alternatives include USBView or USBDeview
```

These tools provide a wealth of information that helps identify potentially interesting devices and understand their basic structure. Unusual device classes, vendor-specific implementations, or devices with multiple interfaces often warrant closer examination.

#### Interface Analysis: Understanding Structure

Once you've identified a target device, the next step is to analyze its logical structure:

* **Endpoint Mapping**: Identify all endpoints, their directions (IN/OUT), and transfer types (Control, Bulk, Interrupt, Isochronous). This mapping reveals how the device communicates and which channels might be most interesting for security assessment.

* **Interface Functionality**: USB devices can have multiple interfaces, each serving a different function. For example, a multifunction printer might have separate interfaces for printing, scanning, and memory card access.

* **Descriptor Hierarchy**: Catalog the complete set of descriptors to understand the device's structure, including any string descriptors that might reveal additional information about functionality.

Tools like `usb-devices` in Linux or more specialized software like USB Descriptor Dumper can extract this structural information, providing insights into how the device is organized and which areas might be most vulnerable to exploitation.

#### Protocol Analysis: Decoding Communication

The final reconnaissance step involves observing and documenting how the device actually communicates:

* **Traffic Capture**: Using tools like Wireshark with USBPcap, USBmon, or hardware analyzers to record the raw USB traffic between the device and host.

* **Command Patterns**: Identify repeated command sequences, data formats, and typical interaction flows. Look for patterns like initialization sequences, authentication exchanges, or command-response pairs.

* **Authentication Mechanisms**: Determine if the device implements any authentication or verification procedures, such as challenge-response protocols, encryption, or checksums.

This protocol analysis often requires patience and pattern recognition skills. The goal is to develop a comprehensive understanding of how the device communicates before attempting any exploitation.

### USB Hacking Tools: The Hardware Hacker's Arsenal

```
┌─────────────────────────────────────────────────┐
│   USB HARDWARE HACKING TOOLKIT                  │
├─────────────────┬──────────────────────────┤
│ HARDWARE             │ SOFTWARE                │
├─────────────────┼──────────────────────────┤
│ Protocol Analyzers   │ Traffic Capture:         │
│ - Beagle USB         │ - Wireshark + USBPcap     │
│ - OpenVizsla         │ - usbmon (Linux)          │
│ - Total Phase        │ - USBTrace               │
├─────────────────┼──────────────────────────┤
│ Breakout/Interface   │ Device Emulation:        │
│ - USB Breakout Board │ - FaceDancer              │
│ - Bus Pirate         │ - USBProxy               │
│ - GoodFET Hardware   │ - Arduino USB Host Shield │
├─────────────────┼──────────────────────────┤
│ Attack Platforms     │ Analysis & Testing:      │
│ - USB Rubber Ducky   │ - PyUSB                  │
│ - Bash Bunny         │ - libusb                 │
│ - O.MG Cable         │ - Kali Linux USB Suite    │
└─────────────────┴──────────────────────────┘
```

Effective USB hacking requires a specialized toolkit that combines both hardware and software components. These tools enable the hardware hacker to observe, analyze, emulate, and manipulate USB communications at various levels of the protocol stack.

#### Hardware Arsenal: Physical Tools for USB Analysis

The physical side of USB hacking involves specialized hardware that can tap into, monitor, and interact with USB connections:

##### Protocol Analyzers: The Digital Microscopes

USB protocol analyzers are the high-precision instruments of USB hacking, allowing you to capture and decode USB traffic at the electrical and protocol levels:

* **Beagle USB Analyzers** (by Total Phase): Professional-grade analyzers capable of monitoring USB 2.0 and 3.0 traffic with timing precision. These devices capture every bit of communication, including the enumeration process, and present it in a decoded, human-readable format.

* **OpenVizsla**: An open-source USB analyzer project that offers capabilities similar to commercial analyzers at a lower cost. While requiring more technical expertise to use, it provides deep visibility into USB communications.

* **Ellisys USB Analyzers**: High-end tools used in professional development that can capture and analyze even the most complex USB interactions.

Protocol analyzers are invaluable when you need to understand exactly how a device communicates, especially for proprietary protocols or when developing custom attacks.

##### Breakout and Interface Tools: Getting Connected

These tools provide the physical connections needed to intercept, monitor, or inject USB traffic:

* **USB Breakout Boards**: Expose individual USB signal lines (D+, D-, VBUS, GND) for monitoring, analysis, or hardware-level manipulation. These simple boards are often the first tool used when physically inspecting USB communications.

* **Bus Pirate**: A versatile multi-protocol tool that can interface with various communication protocols, including USB (with limitations). It's particularly useful for initial exploration and simple command injection.

* **Monitoring Cables**: Specially designed cables with exposed monitoring points or built-in taps that allow connection of analysis equipment without disrupting normal operation.

##### Attack Platforms: Ready-to-Deploy Offensive Tools

Purpose-built devices designed specifically for USB-based attacks:

* **USB Rubber Ducky** (by Hak5): Appears as a standard keyboard but can inject pre-programmed keystrokes at high speed, allowing for rapid command execution or payload delivery.

* **Bash Bunny**: A more advanced attack platform that can emulate various USB device types (keyboard, storage, network adapter) and switch between them programmatically.

* **O.MG Cable**: A covert attack tool disguised as a normal charging/data cable but containing wireless connectivity and attack capabilities.

#### Software Arsenal: Digital Tools for USB Exploitation

The hardware tools are complemented by software that helps capture, analyze, and manipulate USB traffic:

##### Traffic Capture and Analysis

* **Wireshark with USBPcap**: The renowned network protocol analyzer, when combined with the USBPcap extension, becomes a powerful tool for capturing and analyzing USB traffic on Windows systems. Its familiar interface makes it accessible for those already comfortable with network analysis.

* **usbmon** (Linux): A kernel-level USB monitoring system built into Linux that provides visibility into all USB traffic. Used with tools like `wireshark` or simple utilities like `cat /dev/usbmon*`, it offers comprehensive USB traffic monitoring.

* **USB Protocol Analyzer Software**: Applications designed to work with hardware analyzers, providing detailed decoding and visualization of USB communications.

##### Device Emulation and Manipulation

* **FaceDancer**: A powerful USB device emulation platform that allows a computer to present itself as virtually any USB device. By manipulating the USB descriptors and responses, FaceDancer can be used to test how hosts respond to malformed or malicious devices.

* **USBProxy**: Acts as a transparent proxy between a USB host and device, allowing real-time modification of USB traffic. This enables man-in-the-middle attacks against USB communications.

* **GoodFET Software**: Companion software for the GoodFET hardware that facilitates working with various microcontrollers and communication protocols.

##### Development and Testing Frameworks

* **PyUSB**: A Python library that provides easy access to USB devices, allowing rapid development of custom USB tools and attacks.

* **libusb**: A C library that provides low-level access to USB devices across different operating systems, forming the foundation for many USB hacking tools.

* **Kali Linux USB Tools**: The security-focused Linux distribution includes a suite of USB-related tools pre-installed, providing a comprehensive environment for USB security testing.

A skilled hardware hacker typically combines these tools based on the specific target and objectives. For instance, initial reconnaissance might use simple tools like `lsusb` and breakout boards, followed by deeper protocol analysis with Wireshark and USBPcap, culminating in custom attack development using PyUSB or FaceDancer.

## USB Attack Vectors: Exploiting the Universal Interface

```
┌─────────────────────────────────────────────────┐
│          USB ATTACK TAXONOMY                    │
├────────────────────┬─────────────────────────┤
│                      │                        │
│  MASQUERADING ATTACKS │  ┌───────────────┐   │
│  (Fake Device Types)  │  │ HID Injection   │   │
│                      │  │ Mass Storage    │   │
│                      │  │ Network Adapter │   │
│                      │  └───────────────┘   │
│                      │                        │
├────────────────────┼─────────────────────────┤
│                      │                        │
│  FIRMWARE ATTACKS     │  ┌───────────────┐   │
│  (Device Modification) │  │ BadUSB         │   │
│                      │  │ Controller Mod  │   │
│                      │  │ Hidden Function │   │
│                      │  └───────────────┘   │
│                      │                        │
├────────────────────┼─────────────────────────┤
│                      │                        │
│  PROTOCOL EXPLOITATION │  ┌───────────────┐   │
│  (Software Vulnerabilities)│ │ Buffer Overflow │   │
│                      │  │ USB Fuzzing     │   │
│                      │  │ DMA Attacks     │   │
│                      │  └───────────────┘   │
│                      │                        │
└────────────────────┴─────────────────────────┘
```


### USB Device Masquerading: The Wolf in Sheep's Clothing

The most straightforward USB attacks exploit the inherent trust that operating systems place in devices that identify themselves as standard peripherals. By emulating legitimate device types, attackers can bypass security controls that would normally prevent malicious software execution.

#### HID (Human Interface Device) Attacks: The Phantom Typist

HID attacks are among the most prevalent USB attacks due to their simplicity and effectiveness:

```
[Computer] <---- [USB Cable] <---- [Malicious HID Device]
                                    (Appears as keyboard)
    |                                     |
    |                                     |
    |   Automatically trusts "keyboard"   |
    |<------------------------------------|    
    |                                     |
    |   Receives keystroke injection      |
    |<------------------------------------|    
    |   (commands, code, etc.)            |
    v                                     |
[Compromised]                             |
```

These attacks work by having a malicious device present itself as a legitimate keyboard or mouse:

* **Execution Method**: The device injects pre-programmed keystroke sequences that execute commands, launch applications, or download malware - all at superhuman speed (often completing attacks in seconds)

* **Tools**: Devices like the USB Rubber Ducky, Bash Bunny, or DIY solutions using Arduino with USB capabilities are specially designed for these attacks

* **Example Attack Flow**:
  1. Attacker plugs device into target computer
  2. Device is recognized as a standard HID keyboard
  3. Device automatically sends keystrokes to open a command prompt or terminal
  4. Keystroke sequences execute malicious commands (e.g., downloading and executing malware, adding backdoor accounts)
  5. Attack completes within seconds, often before the user can respond

* **Mitigation**: These attacks can be mitigated through USB device whitelisting (allowing only approved devices), physical port security measures, and by using specialized software that monitors for abnormally fast keystroke patterns.

#### Mass Storage Spoofing: The Trojan Drive

Mass storage attacks exploit the automatic mounting and potential auto-execution features of modern operating systems:

* **Execution Methods**:
  - **Autorun Exploitation**: Configuring the device to automatically launch malware when connected (less effective on modern systems with autorun disabled)
  - **Social Engineering**: Disguising malicious executables as legitimate files (e.g., resume.pdf.exe)
  - **Malicious Links**: Creating shortcuts that execute commands instead of opening files
  - **Boot Sector Attacks**: Targeting systems that can boot from USB devices

* **Sophisticated Variants**: Some attacks present a benign partition visible to the user while hiding a second partition containing malicious tools

* **Mitigation**: Disabling autorun features, application whitelisting, and user education about suspicious files are effective countermeasures.

#### Ethernet Adapter Impersonation: The Network Hijacker

More sophisticated than HID or storage attacks, Ethernet adapter impersonation creates rogue network interfaces that can intercept or redirect network traffic:

* **Attack Method**: A malicious device presents itself as a USB Ethernet adapter, which many operating systems will automatically configure with a higher priority than existing network connections

* **Capabilities**:
  - Performing man-in-the-middle attacks on all network traffic
  - DNS spoofing to redirect web requests to malicious sites
  - Network credential theft
  - Internal network reconnaissance once connected

* **Mitigation**: Network connection policies that prevent automatic configuration of new interfaces and USB device control can prevent these attacks.

### USB Firmware Attacks: The Evil Inside

Firmware attacks represent a more insidious threat that targets the very foundation of USB devices - their internal controllers. Unlike masquerading attacks that simply present false device information, firmware attacks actually modify how the device operates at a fundamental level.

#### BadUSB: The Chameleon Attack

The BadUSB attack, first demonstrated by researchers Karsten Nohl and Jakob Lell in 2014, fundamentally changed how security professionals view USB devices:

* **Core Concept**: Most USB devices contain a microcontroller running firmware that can be reprogrammed. By modifying this firmware, an attacker can transform the device's functionality completely.

* **Attack Surface**: The attack exploits the fact that most USB controller firmware has no authenticity verification - any code can be flashed to the controller.

* **Stealth Factor**: What makes BadUSB particularly dangerous is that the attack modifies the firmware, not storage - making it undetectable by antivirus software and persistent across device formatting.

* **Multi-persona Capability**: A modified device can function normally while simultaneously acting maliciously (e.g., a flash drive that works as expected but also registers as a keyboard to inject commands).

#### Example BadUSB Attack Flow

```bash
# 1. Identify the USB controller chipset (common ones include):
#    - Phison (found in many flash drives)
#    - Alcor Micro
#    - Cypress
#    - Realtek

# 2. Dump the existing firmware (device-specific methods)
$ ./usbdump -d /dev/sdX -c phison -o original_firmware.bin

# 3. Modify the firmware to include malicious code
$ ./usbedit -i original_firmware.bin -o modified_firmware.bin -p payload.bin

# 4. Flash the modified firmware back to the device
$ ./usbflash -d /dev/sdX -c phison -i modified_firmware.bin
```

#### Mitigation Strategies

Defending against firmware-level USB attacks is challenging but possible:

* **Hardware USB Data Blockers**: Physical adapters that block data pins while allowing power pins, useful for charging from untrusted sources
* **USB Device Control Policies**: Enterprise solutions that can whitelist specific devices by serial number or other attributes
* **Dedicated Security Hardware**: Specialized USB security gateways that analyze device behavior before allowing connection to the host
* **Verification Systems**: Emerging solutions that attempt to verify firmware integrity, though these are still developing

### USB Protocol Exploitation: Attacking the Software Stack

The third major category of USB attacks targets vulnerabilities in the software that interprets USB communications - the drivers, USB stack, and associated subsystems. These attacks don't rely on social engineering or hardware modification but instead exploit programming flaws.

#### Buffer Overflows: Breaking the Boundaries

Buffer overflow attacks exploit improper memory handling in USB drivers or device firmware:

* **Attack Method**: Sending malformed USB descriptors or data packets that exceed expected buffer sizes
* **Target**: USB device drivers, host controller software, or device firmware
* **Impact**: Potential privilege escalation, code execution, or system crashes
* **Notable Examples**: Many historic Windows and Linux USB driver vulnerabilities have been buffer overflows

#### Fuzzing Techniques: Finding the Breaking Point

USB fuzzing is a systematic approach to discovering USB vulnerabilities:

* **Methodology**: Automatically generating invalid or unexpected USB traffic to test how systems handle edge cases
* **Common Fuzzing Targets**:
  - Device descriptors with invalid lengths or contents
  - Malformed control transfers with unexpected parameters
  - Rapidly changing device states to trigger race conditions
  - Testing boundary conditions in different transfer types

* **Tools**: FaceDancer combined with fuzzing frameworks can programmatically generate thousands of test cases

#### DMA Attacks: Direct Memory Access Exploitation

Perhaps the most powerful USB-based attacks leverage Direct Memory Access capabilities:

* **Attack Vector**: Some USB 3.0/Thunderbolt interfaces provide DMA, allowing peripherals to directly read/write system memory
* **Capabilities**: A malicious device with DMA can:
  - Read memory containing encryption keys, passwords, or sensitive data
  - Modify running code to insert backdoors
  - Bypass operating system security controls entirely
  - Install persistent rootkits

* **Examples**: Tools like PCILeech can perform DMA attacks over USB 3.0 with compatible hardware
* **Mitigation**: IOMMU technology (Intel VT-d or AMD-Vi) can restrict which memory regions devices can access, but must be properly configured

### The Evolving Threat Landscape

USB attacks continue to evolve as new vulnerabilities are discovered and new USB specifications are released. The introduction of USB Type-C and USB 4 brings additional complexity and potential attack surfaces. Hardware hackers and security researchers must stay vigilant, as the convenience and ubiquity of USB ensure it will remain an attractive target for malicious actors.

## USB Device Analysis: From Hardware to Protocol

```
┌─────────────────────────────────────────────────┐
│        USB ANALYSIS WORKFLOW                    │
│                                                │
│   ┌───────────┐   ┌───────────┐   ┌───────────┐   │
│   │ PHYSICAL   │ ──► │ TRAFFIC    │ ──► │ CUSTOM     │   │
│   │ ANALYSIS   │   │ CAPTURE    │   │ INTERACTION│   │
│   └───────────┘   └───────────┘   └───────────┘   │
│   Inspect Device    Monitor Traffic    Test Theories   │
│   Identify ICs      Decode Protocol    Confirm Findings │
│                                                │
└─────────────────────────────────────────────────┘
```

After exploring USB attack vectors, we need to understand how to analyze USB devices methodically. Whether you're examining a suspicious device, reverse-engineering a proprietary protocol, or developing your own security tools, a structured approach to USB analysis helps reveal the inner workings of these complex devices.

### Physical USB Analysis: The Hardware Approach

Before diving into software and protocols, a thorough hardware assessment provides valuable insights and potential access points:

#### Connector Examination: The Gateway

The USB connector itself tells a story about the device's capabilities and potential attack surface:

* **Connector Type**: Identifies the USB generation and capabilities (Type-A, Type-B, Type-C, Mini, Micro)
* **Pin Mapping**: Standard USB 2.0 uses 4 pins (VBUS, D+, D-, GND), while USB 3.0+ adds additional pins for SuperSpeed lanes
* **Signal Access**: Identifying where to physically tap into each signal for monitoring or manipulation

Breaking out these connections often requires custom cables or adapters that expose individual pins for analysis equipment.

#### PCB Investigation: Following the Trail

Opening the device and examining its printed circuit board (PCB) reveals the data paths and key components:

* **Signal Tracing**: Following the USB data lines (D+/D-) from the connector to the controller chip
* **Identifying Test Points**: Manufacturers often leave test points connected to USB signals for factory testing
* **Bus Analysis**: Examining how the USB controller interfaces with other components (memory, microprocessors)
* **Component Identification**: Looking for additional interfaces (UART, JTAG, SPI) that might provide alternative access

#### USB Controller Identification: Finding the Brain

The USB controller IC is the central component that manages all USB communication:

* **Chip Marking**: Identifying manufacturer logos, part numbers, or date codes
* **Controller Research**: Looking up datasheets and known vulnerabilities for the specific controller
* **Architecture Assessment**: Determining if the controller is standalone or integrated into a larger SoC
* **Firmware Storage**: Locating where the device's firmware is stored (often in separate flash memory)

Understanding the specific controller model is particularly important when investigating potential firmware modification (BadUSB) capabilities, as each controller family has different programming methods and security features.

### USB Traffic Capture & Analysis: Decoding the Conversation

After physical examination, monitoring the actual USB communication reveals how the device operates and potential security flaws:

#### Setting Up a Capture Environment

Before analyzing traffic, you need to establish a proper monitoring environment:

```bash
# Linux USB monitoring setup - preferred for its transparency
+# Enable the USB monitoring kernel module
+sudo modprobe usbmon
+
+# Make the monitoring device nodes accessible
+sudo chmod 644 /dev/usbmon*
+
+# Start Wireshark with appropriate permissions
+sudo wireshark
+
+# Windows alternative: Install USBPcap and use with Wireshark
+```

Once your capture environment is configured, you can connect the target device and begin recording all USB traffic between it and the host system. For more detailed analysis, hardware protocol analyzers provide timing precision and lower-level signal information.

#### Analysis Methodology: The Detective Work

Successful USB traffic analysis follows a logical progression:

1. **Capture Initial Enumeration**: Record the device identification and configuration process, which reveals descriptors, endpoints, and capabilities

2. **Identify Operational Patterns**: Observe how the device behaves during normal operation:
   * Which endpoints are actively used?
   * What types of transfers occur (control, bulk, interrupt, isochronous)?
   * Is there a predictable command-response pattern?

3. **Decode Control Transfers**: These typically contain command structures that control device operation
   * Note standard USB requests (GET_DESCRIPTOR, SET_CONFIGURATION, etc.)
   * Identify vendor-specific requests that may implement proprietary functionality

4. **Map Data Flows**: For bulk and interrupt transfers, analyze the data content:
   * Look for headers, checksums, or fixed patterns
   * Identify data encoding schemes (ASCII, binary structures, etc.)
   * Note timing patterns (polling intervals, bulk transfer sizes)

5. **Isolate Security Mechanisms**: Pay special attention to:
   * Authentication sequences
   * Encryption indicators (random-looking data patterns)
   * Challenge-response mechanisms
   * Error responses to invalid commands

#### Protocol Reverse Engineering: Cracking the Code

With captured traffic in hand, the next step is deciphering the meaning of the communications:

* **Pattern Recognition**: Identifying repeated byte sequences that might indicate commands or headers
* **Differential Analysis**: Making small changes to inputs and observing changes in the USB traffic
* **Command Mapping**: Creating a dictionary of observed commands and their effects
* **Protocol Documentation**: Building a comprehensive description of how the device communicates

This reverse engineering process is iterative - hypotheses are formed, tested through custom interactions, and refined based on observed results.

### Custom USB Communication: Confirming Your Theories

The final phase of USB analysis involves directly communicating with the device to test theories and potentially exploit discovered vulnerabilities:

#### PyUSB: Python for USB Interaction

Python with the PyUSB library provides a flexible, high-level interface for USB experimentation:

```python
import usb.core
import usb.util

# Find our device by Vendor ID and Product ID
dev = usb.core.find(idVendor=0x1234, idProduct=0x5678)

if dev is None:
    raise ValueError("Device not found")

# Set the active configuration (usually the first one)
try:
    dev.set_configuration()
except:
    pass  # Already configured
    
# Send a control transfer (common for commands)
# Parameters: bmRequestType, bRequest, wValue, wIndex, data_or_length
response = dev.ctrl_transfer(0xC0,  # IN, Vendor, Device
                           0x01,   # Custom request code
                           0,      # Value
                           0,      # Index
                           64)     # Length/data
print(f"Control response: {response}")

# Write data to an endpoint (e.g., sending a command)
dev.write(0x01, [0x01, 0x02, 0x03, 0x04])  # EP 1 OUT

# Read data from an endpoint (e.g., getting a response)
try:
    data = dev.read(0x81, 64, timeout=1000)  # EP 1 IN, 64 bytes max
    print(f"Received: {data}")
except usb.core.USBError as e:
    print(f"Read error: {e}")
```

This Python approach is ideal for rapid prototyping and testing various USB communication hypotheses.

#### libusb: Lower-Level C Implementation

For performance-critical applications or when more direct control is needed, libusb in C provides low-level access:

```c
#include <stdio.h>
#include <stdlib.h>
#include <libusb.h>

int main() {
    libusb_device_handle *handle;
    unsigned char data[64];
    int result;
    
    // Initialize libusb
    if (libusb_init(NULL) < 0) {
        fprintf(stderr, "Error initializing libusb\n");
        return 1;
    }
    
    // Open device by VID/PID
    handle = libusb_open_device_with_vid_pid(NULL, 0x1234, 0x5678);
    if (handle == NULL) {
        fprintf(stderr, "Could not find/open device\n");
        libusb_exit(NULL);
        return 1;
    }
    
    // Claim interface 0 (typically the first interface)
    libusb_claim_interface(handle, 0);
    
    // Send control transfer
    result = libusb_control_transfer(handle,
                                   0xC0,  // bmRequestType
                                   0x01,  // bRequest
                                   0,     // wValue
                                   0,     // wIndex
                                   data,  // data buffer
                                   sizeof(data), // length
                                   1000); // timeout (ms)
    
    printf("Control transfer returned: %d\n", result);
    if (result > 0) {
        printf("Received data: ");
        for (int i = 0; i < result; i++) {
            printf("%02x ", data[i]);
        }
        printf("\n");
    }
    
    // Clean up
    libusb_release_interface(handle, 0);
    libusb_close(handle);
    libusb_exit(NULL);
    
    return 0;
}
```

The C approach offers more direct control and can be essential when developing tools that need to operate at high performance or with precise timing requirements.

### Building a Complete Picture

Successful USB device analysis combines all three approaches - physical inspection, traffic monitoring, and custom interaction - to develop a comprehensive understanding of how a device operates. This multi-faceted analysis approach forms the foundation for security assessments, vulnerability discovery, and the development of custom exploitation tools.

For hardware hackers, the goal is to move from passive observation to active experimentation, ultimately gaining the knowledge needed to manipulate the device's operation or extract sensitive information.

## USB Security Testing Case Studies: Real-World Applications

```
┌─────────────────────────────────────────────────┐
│                                                │
│      CASE STUDY 1             CASE STUDY 2      │
│  ┌─────────────┐        ┌─────────────┐   │
│  │ FLASH DRIVE  │        │  USB HID     │   │
│  │ FIRMWARE     │        │  PROTOCOL    │   │
│  │ ANALYSIS     │        │  ANALYSIS    │   │
│  └─────────────┘        └─────────────┘   │
│     BadUSB               Custom Protocol         │
│  Assessment              Reverse Engineering     │
│                                                │
└─────────────────────────────────────────────────┘
```

Theory is important, but there's no substitute for hands-on experience. The following case studies demonstrate practical applications of the USB security testing techniques we've explored. These examples illustrate real-world scenarios that hardware hackers frequently encounter and provide a template for your own investigations.

### Case Study 1: USB Flash Drive Firmware Analysis

#### Target & Objective

A common USB flash drive was selected for firmware analysis to assess its vulnerability to BadUSB attacks. The main objective was to determine whether the device could be reprogrammed to function as a malicious HID device while still appearing to be a standard storage device.

#### Methodology: The Firmware Hunt

```
┌─────────────────────────────────────────────────┐
│  FLASH DRIVE FIRMWARE ANALYSIS WORKFLOW         │
├──────────────────┬──────────────────────────┤
│ 1. DISASSEMBLY        │ Open device, locate controller │
├──────────────────┼──────────────────────────┤
│ 2. CONTROLLER ID     │ Identify chip manufacturer    │
├──────────────────┼──────────────────────────┤
│ 3. FIRMWARE DUMP     │ Extract existing firmware    │
├──────────────────┼──────────────────────────┤
│ 4. FIRMWARE ANALYSIS │ Reverse engineer code        │
├──────────────────┼──────────────────────────┤
│ 5. MODIFICATION TEST  │ Attempt firmware injection   │
├──────────────────┼──────────────────────────┤
│ 6. SECURITY ASSESSMENT│ Evaluate attack viability    │
└──────────────────┴──────────────────────────┘
```

The assessment followed a systematic approach:

1. **Physical Examination**: The drive was carefully disassembled to expose the PCB, revealing a Phison 2303 controller chip - a common controller in budget flash drives.

2. **Controller Research**: Extensive research revealed that the Phison 2303 was vulnerable to firmware manipulation through vendor-specific USB commands, with existing tools available for interacting with this controller family.

3. **Firmware Extraction**: Using a combination of the PhisonTools suite and custom scripts, the team successfully dumped the existing firmware through a series of vendor-specific control transfers:

   ```bash
   # After connecting the drive and finding its device node
   $ sudo ./phison_dumper /dev/sdb phison_fw_backup.bin
   [+] Found target device
   [+] Initiating firmware dump sequence
   [+] Dumped 128KB firmware to phison_fw_backup.bin
   [+] Verifying firmware integrity... OK
   ```

4. **Firmware Analysis**: The extracted firmware binary was analyzed using a combination of disassembly tools and hex editors. Key findings included:
   - No cryptographic signature verification for firmware updates
   - Simple checksum validation that could be easily replicated
   - Modular code structure with clearly identified USB descriptor sections
   - No hardware-level write protection for the firmware storage

5. **Payload Development**: A custom firmware was developed that:  
   - Maintained original mass storage functionality
   - Added a secondary HID keyboard interface
   - Included a payload that would type predefined commands when connected
   - Preserved the device's original VID/PID to avoid obvious detection

6. **Testing and Verification**: The modified firmware was successfully flashed to the device, and testing confirmed its dual functionality as both a storage device and a keystroke injection tool.

#### Findings & Security Implications

The investigation confirmed severe security issues with the target device:

* **No Firmware Authentication**: The controller accepted any properly formatted firmware image without verification
* **Dual-Personality Capability**: The modified device could simultaneously function as storage while executing malicious code
* **Stealth Operation**: The attack was undetectable by standard USB device monitoring tools that only check VID/PID
* **Persistence**: The firmware modification survived formatting and OS-level security measures

Most alarmingly, these findings were consistent with other budget flash drives using similar controllers, suggesting a widespread vulnerability across the consumer USB storage market.

### Case Study 2: USB HID Device Protocol Reverse Engineering

#### Target & Objective

A proprietary USB HID device (a specialized industrial controller) was analyzed to understand its communication protocol. The objective was to replicate its functionality, potentially identifying security vulnerabilities in the process.

#### Methodology: Protocol Deconstruction

The investigation followed these steps:

1. **Device Identification**: Initial USB enumeration revealed a custom HID device with unique descriptor properties indicating proprietary usage.

2. **Traffic Capture**: Using Wireshark with USBPcap, all communication between the device and its control software was recorded during various operations:

   ```bash
   # Linux traffic capture setup
   $ sudo modprobe usbmon
   $ sudo chmod 644 /dev/usbmon*
   $ sudo wireshark -i usbmon1  # Capture from appropriate bus
   ```

3. **Data Analysis**: The captured traffic revealed several patterns:
   - Commands were sent via feature reports (HID SET_REPORT requests)
   - Each command started with a consistent 2-byte header
   - Responses used a different endpoint with a similar but distinct format
   - All multi-byte values used little-endian byte ordering

4. **Command Mapping**: By systematically triggering different functions in the control software and observing the corresponding USB traffic, a comprehensive command dictionary was compiled.

5. **Protocol Verification**: A custom Python script using PyUSB was developed to send commands and parse responses:

   ```python
   def send_command(dev, command_code, parameters=None):
       # Command structure: [0xA5, command_code, len, params..., checksum]
       if parameters is None:
           parameters = []
       data = [0xA5, command_code, len(parameters)] + parameters
       # Add simple XOR checksum
       data.append(calculate_checksum(data))
       # Send using HID feature report
       dev.ctrl_transfer(0x21, 0x09, 0x0300, 0, data)
       # Read response
       response = dev.read(0x81, 64, timeout=1000)
       return parse_response(response)
   ```

6. **Security Assessment**: Testing revealed several security issues:
   - No authentication mechanism for commands
   - Predictable command sequence numbers
   - Weak checksum algorithm for data validation
   - Undocumented diagnostic commands that provided elevated privileges

#### Findings & Security Implications

The reverse engineering effort yielded several important insights:

* **Protocol Weaknesses**: The proprietary protocol relied on obscurity rather than strong security mechanisms
* **Undocumented Functionality**: Several powerful capabilities were discovered that weren't documented or exposed in the official interface
* **No Authentication**: Any device with knowledge of the protocol could send valid commands without authentication
* **Replay Vulnerability**: Captured command sequences could be replayed to reproduce actions

These findings highlighted how proprietary USB protocols often prioritize functionality over security, assuming that the complexity of the communication would be sufficient protection against unauthorized access.

## The Hardware Hacker's Journey: Mastering USB Security

As we conclude our exploration of USB security, it's clear that this ubiquitous interface presents both significant challenges and opportunities for hardware hackers. From its physical layer to its complex communication protocols, USB offers multiple entry points for security analysis and potential exploitation.

The skills and methodologies we've covered form a comprehensive toolkit for approaching USB devices with a security mindset:

* **Understanding the fundamentals** of USB architecture and communication
* **Recognizing common attack vectors** including device masquerading, firmware manipulation, and protocol exploitation
* **Applying systematic analysis techniques** from physical inspection to protocol reverse engineering
* **Developing custom tools** for interacting with and testing USB devices
* **Thinking critically about security implications** of USB design decisions

As hardware systems continue to evolve, USB will undoubtedly remain a critical interface - and therefore a critical attack surface. The techniques presented in this chapter are not just academic exercises but practical skills that security researchers apply daily to uncover vulnerabilities, build more secure systems, and advance our understanding of hardware security.

In the next section, we'll explore another important protocol in the hardware hacker's arsenal. However, the principles we've covered for USB analysis - methodical investigation, layered understanding, and systematic testing - apply broadly across all hardware security domains.

The most valuable takeaway is the structured approach to hardware analysis: begin with physical inspection, progress to protocol analysis, verify through custom interaction, and thoroughly document your findings. This methodology, more than any specific tool or technique, is what distinguishes effective hardware hackers and security researchers.




---

## Navigation

**Section: Wired Protocols**

* Previous: [JTAG/SWD](04-jtag-swd.md)
* Next: [Ethernet Protocols](06-ethernet-protocols.md)
* [Back to Main Index](../../../README.md)
