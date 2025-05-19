# I²C (Inter-Integrated Circuit) Protocol

The I²C (Inter-Integrated Circuit) protocol is a widely used communication standard in embedded systems, enabling multiple devices to communicate over just two wires. For hardware hackers, I²C interfaces present unique opportunities and challenges for security assessment.

## I²C Fundamentals

### Basics of I²C

- **Two-Wire Interface**: SCL (clock) and SDA (data)
- **Master-Slave Architecture**: One or more masters control multiple slaves
- **Addressable**: Each slave device has a unique 7-bit or 10-bit address
- **Speeds**: Standard (100 kHz), Fast (400 kHz), Fast+ (1 MHz), High-speed (3.4 MHz)
- **Bidirectional**: Data can flow both ways
- **Open-Drain**: Requires pull-up resistors on both lines

### Signal Structure

1. **Start Condition**: SDA transitions from high to low while SCL is high
2. **Address Frame**: 7 or 10-bit address plus R/W bit
3. **Acknowledgment (ACK)**: Receiver pulls SDA low during 9th clock cycle
4. **Data Frames**: 8-bit data followed by ACK/NACK
5. **Stop Condition**: SDA transitions from low to high while SCL is high

## Identifying I²C Interfaces

### Visual Identification

1. **Look for labeled pins**: SCL/SDA, I²C, TWI (Two-Wire Interface)
2. **Pull-up resistors**: Often 4.7kΩ or 10kΩ connected to these lines
3. **Connected devices**: EEPROM, sensors, display controllers, etc.
4. **Header arrangement**: Often grouped together with VCC and GND

### Electrical Identification

1. **Pull-up behavior**: Both lines should rest at logic high when idle
2. **Logic analyzer pattern**: Distinctive start/stop conditions and clock patterns
3. **Multimeter**: Measure resistance to VCC (will show pull-up resistors)

## Hardware for I²C Hacking

### Essential Tools

1. **Logic analyzer**: To monitor I²C traffic (with I²C protocol decode)
2. **I²C adapter**: USB to I²C converter or microcontroller-based solution
3. **Bus Pirate**: Versatile tool for I²C and other protocols
4. **Jumper wires**: For connecting to test points
5. **Protocol analyzer software**: Saleae Logic, Sigrok/PulseView, etc.

### Software Tools

1. **i2c-tools**: Linux utility for I²C bus scanning and interaction
2. **Arduino Wire library**: For Arduino-based I²C experimentation
3. **libi2c**: C library for I²C communication
4. **Python-SMBus**: Python library for I²C access

## I²C Hacking Techniques

### Bus Scanning

1. **Address scanning**: Enumerate all devices on the bus
2. **Register scanning**: Probe registers on each device
3. **Device identification**: Determine device types based on addresses/registers
4. **Example command**: `i2cdetect -y 1` (on Linux)

### Passive Sniffing

1. **Logic analyzer connection**: Connect to SCL and SDA lines
2. **Monitoring startup**: Capture initialization sequences
3. **Analysis**: Decode address, register, and data values
4. **Timing observation**: Look for periodic communications

### Active Attacks

1. **Man-in-the-Middle**: Intercept and modify communications
2. **Device spoofing**: Impersonate a legitimate device
3. **Clock manipulation**: Control timing to disrupt normal operation
4. **Bus injection**: Insert unauthorized commands

### Data Extraction

1. **Memory dump**: Read from EEPROM or other memory devices
2. **Configuration extraction**: Obtain device settings
3. **Sensitive data retrieval**: Keys, credentials, etc.
4. **Firmware extraction**: Some microcontrollers support I²C programming

## Common I²C Security Issues

1. **No authentication**: Any device can communicate on the bus
2. **Lack of encryption**: All data transmitted in cleartext
3. **Accessible EEPROMs**: Unprotected storage of sensitive data
4. **Weak access controls**: Limited or no read/write protection
5. **Bus exposure**: Test points or headers providing physical access
6. **Side-channel attacks**: Information leakage through timing or power analysis

## Practical I²C Hacking Exercise: EEPROM Extraction

### Extracting Data from an I²C EEPROM

**Equipment needed:**
- Target device with I²C EEPROM
- Logic analyzer or Bus Pirate
- Jumper wires
- Computer with appropriate software

**Procedure:**
1. Identify the I²C EEPROM on the target board
2. Locate and connect to SCL, SDA, GND, and optionally VCC
3. Use bus scanning to verify the EEPROM address (typically 0x50-0x57)
4. Read the EEPROM contents using appropriate commands
5. Analyze the extracted data for sensitive information
6. Document findings and potential security impacts

## Securing I²C Communications

As a hardware hacker, understanding proper security measures helps identify weaknesses:

1. **Physical protection**: Limit access to I²C lines
2. **Authentication mechanisms**: Implement challenge-response protocols
3. **Encryption**: Encrypt sensitive data before transmission
4. **Address filtering**: Restrict which addresses can communicate
5. **Bus monitoring**: Detect unauthorized activities
6. **Limited exposure**: Avoid exposing I²C on external connectors

## Advanced I²C Topics

### I²C Variants and Extensions

1. **SMBus (System Management Bus)**: Stricter timing, specific commands
2. **PMBus (Power Management Bus)**: Extension of SMBus for power management
3. **I³C (Improved Inter-Integrated Circuit)**: Backward compatible but faster
4. **TWI**: Atmel's I²C-compatible interface

### Multi-master Configurations

1. **Arbitration process**: How multiple masters negotiate bus control
2. **Clock stretching**: Slave device can hold clock low to pause communication
3. **Security implications**: Additional complexity can create vulnerabilities

## Conclusion

I²C interfaces are ubiquitous in embedded systems and often provide access to critical components like EEPROMs, sensors, and configuration devices. Understanding the protocol enables hardware hackers to extract valuable information and potentially manipulate system behavior.

In the next section, we'll explore [SPI Protocol](./05c-spi-protocol.md), another common communication standard with different characteristics and security implications.
