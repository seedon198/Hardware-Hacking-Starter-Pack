# USB (Universal Serial Bus) Protocol

Universal Serial Bus (USB) is one of the most prevalent external interfaces in modern electronic devices. Its ubiquity and complexity make it both an attractive and challenging target for hardware hackers.

## USB Fundamentals

### USB Architecture

- **Host-Device Model**: One host controller communicates with multiple peripherals
- **Layered Protocol**: Physical, Data Link, Protocol, and Application layers
- **Multiple Speeds**: Low (1.5 Mbps), Full (12 Mbps), High (480 Mbps), SuperSpeed (5+ Gbps)
- **Power Delivery**: Provides both data and power to peripherals
- **Hot-Pluggable**: Devices can be connected/disconnected while powered

### USB Signal Lines

1. **D+/D-**: Differential data lines for USB 2.0 and earlier
2. **VBUS**: +5V power supply
3. **GND**: Ground reference
4. **Additional lines in USB 3.0+**: SSTX+/-, SSRX+/- for SuperSpeed data

### USB Communication Model

1. **Enumeration**: Device identification and initialization process
2. **Endpoints**: Logical communication channels within devices
3. **Transfers**: Control, Bulk, Interrupt, and Isochronous
4. **Descriptors**: Device, Configuration, Interface, Endpoint information

## USB Hacking Methodology

### USB Reconnaissance

1. **Device identification**: 
   - Vendor/Product IDs (VID/PID)
   - Device class and capabilities
   - Example tools: `lsusb`, USBView, USBlyzer

2. **Interface analysis**: 
   - Identify endpoints and transfer types
   - Understand device functionality
   - Map USB descriptors

3. **Protocol analysis**:
   - Capture and decode USB traffic
   - Identify patterns and command structures
   - Determine authentication mechanisms

### USB Hacking Tools

1. **Hardware Tools**:
   - USB protocol analyzers (Beagle USB, OpenVizsla)
   - USB breakout boards and monitoring cables
   - BadUSB devices (like USB Rubber Ducky)
   - USB proxies (like USBProxy)

2. **Software Tools**:
   - Wireshark with USBPcap
   - USBPcap
   - usbmon (Linux)
   - FaceDancer and GoodFET
   - Kali Linux USB tools suite

## Common USB Attack Vectors

### USB Device Masquerading

1. **HID Attacks**: Emulating keyboard/mouse to inject commands
   - Tools: USB Rubber Ducky, Arduino-based keystroke injection
   - Mitigation: USB device whitelisting, physical security

2. **Mass Storage Spoofing**: Presenting malicious storage devices
   - Techniques: Autorun manipulation, executable disguising
   - Mitigation: Disable autorun, use application whitelisting

3. **Ethernet Adapter Impersonation**: Creating rogue network interfaces
   - Attack: Setting up man-in-the-middle via USB Ethernet
   - Mitigation: Network connection policies, USB device control

### USB Firmware Attacks

1. **BadUSB**: Reprogramming USB controller firmware
   - Converting any USB device into attack platform
   - Undetectable by conventional anti-malware
   - Based on USB controller vulnerability

2. **Example attack flow**:
   ```
   # Identify controller (often Phison, Alcor, etc.)
   # Dump existing firmware
   # Modify firmware to include malicious payload
   # Reflash controller with modified firmware
   ```

3. **Mitigation strategies**:
   - Hardware USB data blockers
   - USB device control policies
   - Verification of trusted devices

### USB Protocol Exploitation

1. **Buffer Overflows**: Sending malformed descriptors or data
   - Target USB drivers or device firmware
   - Achieve code execution or privilege escalation

2. **Fuzzing Techniques**:
   - Manipulate USB descriptors
   - Generate invalid command sequences
   - Test boundary conditions in transfers

3. **DMA Attacks**: Direct Memory Access exploitation
   - Techniques like Thunderstrike (Thunderbolt/USB-C)
   - PCILeech for DMA over USB 3.0

## USB Device Analysis Techniques

### Physical USB Analysis

1. **Connector inspection**: Identifying data lines
2. **PCB tracing**: Following USB routing to controller
3. **Test point location**: Finding debug access near USB controller
4. **Chip identification**: Locating and researching USB controller ICs

### USB Traffic Capture & Analysis

1. **Setup capture environment**:
   ```bash
   # Linux USB monitoring setup
   sudo modprobe usbmon
   sudo chmod 644 /dev/usbmon*
   # Capture with Wireshark or tcpdump
   ```

2. **Analysis approach**:
   - Identify device enumeration process
   - Map control transfers and their purposes
   - Document recurring command patterns
   - Isolate authentication or encryption mechanisms

3. **Reverse engineering USB protocols**:
   - Compare known commands with observed traffic
   - Look for patterns in data transfers
   - Test hypotheses with custom USB communications

### Custom USB Communication

1. **Using PyUSB**: Python library for USB communication
   ```python
   import usb.core
   import usb.util
   
   # Find device by VID/PID
   dev = usb.core.find(idVendor=0x1234, idProduct=0x5678)
   
   # Send control transfer
   dev.ctrl_transfer(0xC0, 0x01, 0, 0, 64)
   
   # Write to endpoint
   dev.write(1, [0x01, 0x02, 0x03, 0x04])
   
   # Read from endpoint
   data = dev.read(0x81, 64)
   ```

2. **Using libusb in C**:
   ```c
   #include <libusb.h>
   
   // Initialize libusb
   libusb_init(NULL);
   
   // Open device by VID/PID
   libusb_device_handle *handle = libusb_open_device_with_vid_pid(NULL, 0x1234, 0x5678);
   
   // Send control transfer
   unsigned char data[64];
   libusb_control_transfer(handle, 0xC0, 0x01, 0, 0, data, sizeof(data), 1000);
   ```

## USB Security Testing Case Studies

### Case Study: USB Flash Drive Firmware Analysis

**Target**: Common USB flash drive with potential for BadUSB vulnerability

**Process**:
1. Identify the controller chip (often requires disassembly)
2. Research known vulnerabilities or programming methods for the controller
3. Attempt to dump the existing firmware
4. Analyze firmware for authentication/verification mechanisms
5. Test firmware modification and reflashing
6. Assess security implications of successful modification

**Findings**:
- Many low-cost drives use controllers with no firmware verification
- Modified firmware can alter device behavior fundamentally
- Most controllers allow complete reprogramming without authentication

### Case Study: USB HID Device Protocol Analysis

**Target**: Proprietary USB HID device with custom protocol

**Process**:
1. Capture USB traffic during normal device operation
2. Identify patterns in control and interrupt transfers
3. Create a protocol map of commands and responses
4. Develop a tool to emulate legitimate device communications
5. Test for command validation or authentication weaknesses

**Findings**:
- Many proprietary protocols lack proper authentication
- Command validation often minimal or bypassable
- Replay attacks frequently possible

## Securing USB Interfaces

From a hardware hacker's perspective, understanding these countermeasures helps identify vulnerabilities:

1. **USB Data Blockers**: Physical adapters that block data lines
2. **USB Port Control**: System policies restricting USB device types
3. **Device Whitelisting**: Allowing only specific VID/PID combinations
4. **USB Sandboxing**: Isolating USB device drivers from the system
5. **Firmware Verification**: Cryptographic verification of device firmware
6. **Physical Port Protection**: Physically securing or disabling USB ports

## Practical USB Hacking Exercise

### Analyzing Unknown USB Device Protocol

**Equipment needed**:
- Target USB device
- Computer with Wireshark + USBPcap or Linux with usbmon
- USB breakout board (optional)
- Python with PyUSB library

**Procedure**:
1. Document physical characteristics and markings of the device
2. Identify the device with `lsusb` or device manager
3. Capture USB traffic during normal device operation
4. Analyze the captured traffic to identify patterns:
   - Enumerate control transfers
   - Document data transfers
   - Map command sequences to device functions
5. Create a simple script to reproduce captured commands
6. Experiment with modifying commands to test device behavior

## Advanced USB Hacking Topics

### Hardware-Based USB Attacks

1. **Data line tapping**: Physical interception of USB signals
2. **Power analysis**: Monitoring power consumption during operations
3. **Signal integrity attacks**: Manipulation of electrical characteristics
4. **Hardware keystroke injection**: Autonomous USB attack platforms

### USB-C and Modern Interfaces

1. **USB Power Delivery exploitation**: Manipulating power negotiation
2. **Alternate Mode attacks**: Exploiting DisplayPort or Thunderbolt modes
3. **USB 3.0+ security implications**: Higher bandwidth for data exfiltration
4. **CC line analysis**: Exploiting USB-C configuration channel

## Conclusion

USB represents one of the most common attack surfaces on modern devices. Its complexity, ubiquity, and access privileges make it an attractive target for hardware hackers. Understanding USB protocols and security is essential for comprehensive hardware security assessment.

The tools and techniques covered in this section provide a foundation for analyzing USB devices, discovering vulnerabilities, and understanding potential attack vectors. As USB continues to evolve with higher speeds and capabilities, the security implications will only become more significant.

In the next section, we'll explore [Ethernet and Network Protocols](./05f-ethernet-protocols.md), which provide another important avenue for hardware attacks.
