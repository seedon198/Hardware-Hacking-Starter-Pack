# UART/Serial Communication

UART (Universal Asynchronous Receiver-Transmitter) is one of the most common and simplest protocols you'll encounter in hardware hacking. It's often used for debugging, device configuration, and internal communication between components.

## UART Fundamentals

### Basics of UART

- **Asynchronous Communication**: No shared clock signal
- **Typically Full-Duplex**: Simultaneous two-way communication
- **Minimal Pins**: Usually just 2-3 pins (TX, RX, GND)
- **Common Baud Rates**: 9600, 115200, 57600, 38400
- **Data Format**: Start bit, data bits (typically 8), optional parity bit, stop bit(s)

### UART vs RS-232

UART is the protocol, while RS-232 is a specific electrical standard:
- UART typically uses 3.3V or 5V logic levels
- RS-232 uses higher voltages (±5V to ±15V)
- Many "serial ports" use RS-232 electrical levels with UART protocol
- Level converters (MAX232 or similar) translate between the two

## Identifying UART Interfaces

### Visual Identification

1. **Look for labeled pins**: TX/RX, UART, CONSOLE, DEBUG
2. **3-4 pin headers**: Often in a row or group
3. **Unpopulated header areas**: Check for TX/RX silkscreen labels
4. **Test points**: Small circular pads, sometimes labeled

### Pin Discovery Techniques

1. **Visual tracing**: Follow PCB traces from suspected UART pins to MCU
2. **Multimeter continuity**: Trace connections from known MCU UART pins
3. **Logic analyzer/oscilloscope**: Look for digital signals during boot

## Connecting to UART Interfaces

### Required Equipment

- USB-to-UART adapter (FT232, CP2102, CH340G, etc.)
- Jumper wires
- Logic level converter (if voltage levels differ)
- Terminal software (minicom, screen, PuTTY, etc.)

### Connection Process

1. **Identify ground**: Essential for common reference
2. **Identify TX/RX**: Remember that TX from device connects to RX on your adapter
3. **Determine voltage**: Use multimeter to measure, typically 3.3V or 5V
4. **Connect appropriate wires**: GND to GND, Device TX to Adapter RX, Device RX to Adapter TX
5. **Start terminal software**: Configure with correct serial port and baud rate

## Working with UART

### Finding the Correct Baud Rate

If the baud rate is unknown:
1. **Common rates**: Try 9600, 115200, 57600, 38400 first
2. **Automated tools**: Use baudrate.py or similar tools
3. **Oscilloscope method**: Measure time of one bit and calculate: 1/(bit time) = baud rate
4. **Logic analyzer**: Most have automatic baud rate detection

### Terminal Software Configuration

Typical settings:
- **Data bits**: 8
- **Parity**: None
- **Stop bits**: 1
- **Flow control**: None
- **Baud rate**: As determined

### Common UART Security Issues

1. **Accessible debug interfaces**: Unauthenticated root shells or bootloaders
2. **Exposed firmware update mechanisms**: Ability to upload modified firmware
3. **Unencrypted sensitive data**: Credentials or encryption keys in logs
4. **Command injection**: Input validation flaws in UART command processors
5. **Information leakage**: Boot logs revealing system details

## UART Hacking Techniques

### Boot Process Interception

1. **Boot message analysis**: Gather system information from boot logs
2. **Bootloader interruption**: Press specific keys during boot to access bootloader
3. **Command injection**: Modify boot parameters

### Debug Console Access

1. **Default credentials**: Try common username/password combinations
2. **Authentication bypass**: Look for bypasses or backdoors
3. **Command injection**: Test for improper input validation

### Hardware Modification

1. **UART injection**: Insert malicious commands during boot or operation
2. **Man-in-the-middle**: Intercept and modify UART traffic
3. **Bus monitoring**: Passively capture sensitive information

## Practical UART Hacking Exercise

### Finding and Connecting to a Router's UART

**Equipment needed:**
- Router (old/unused)
- USB-UART adapter
- Jumper wires
- Multimeter
- Computer with terminal software

**Procedure:**
1. Open the router case and locate potential UART pins
2. Identify GND using continuity testing against known ground points
3. Identify VCC by measuring voltage when the device is powered
4. Test remaining pins for TX by observing during boot
5. Connect your UART adapter and configure terminal software
6. Document boot messages and explore available commands
7. Test for authentication requirements and security controls

### Securing UART Interfaces

As a hardware hacker, understanding how to properly secure UART is important:

1. **Disable in production**: Use hardware or software methods to disable UART
2. **Authentication**: Implement strong authentication for debug interfaces
3. **Encryption**: Encrypt sensitive data transmitted over UART
4. **Physical protection**: Make UART pins difficult to access
5. **Remove debug headers**: Don't include debug headers in production boards

## Conclusion

UART interfaces frequently provide a direct path into a device's internal operations, making them a primary target for hardware hackers. Their simplicity and prevalence make them an excellent starting point for hardware security assessment.

In the next section, we'll explore [I²C Protocol](./05b-i2c-protocol.md), another common communication standard with different security implications.
