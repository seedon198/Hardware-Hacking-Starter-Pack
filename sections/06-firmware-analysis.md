# Firmware Extraction & Analysis

Firmware is the software that directly controls hardware functionality. Accessing and analyzing firmware is a critical skill for hardware hackers as it can reveal vulnerabilities, backdoors, and sensitive information that may not be visible through external interfaces alone.

## Introduction to Firmware

### What is Firmware?

Firmware represents the low-level software that provides the necessary instructions for how the device communicates with its own hardware. It sits between hardware and higher-level software:

- **Location**: Stored in non-volatile memory (Flash, EEPROM, etc.)
- **Purpose**: Controls hardware initialization, core functionality, and low-level operations
- **Accessibility**: Often not directly accessible to end-users by design
- **Security Impact**: Contains critical security mechanisms and potentially sensitive data

### Types of Firmware

1. **Bootloader**
   - First code executed on power-up
   - Initializes hardware and loads main firmware
   - Often contains security checks and authentication mechanisms

2. **Main Application Firmware**
   - Primary functionality of the device
   - Often the largest firmware component
   - Contains business logic and feature implementations

3. **Peripheral Controller Firmware**
   - Manages specific hardware components (Wi-Fi chips, USB controllers, etc.)
   - May be updatable separately from main firmware
   - Often overlooked in security assessments

## Firmware Extraction Methods

### Non-invasive Extraction

1. **Official Update Files**
   - Download from manufacturer's website
   - Extract from update utilities or apps
   - Often the easiest method but may be encrypted or obfuscated

2. **UART/Debug Port Extraction**
   - Accessing bootloader or shell via debug interfaces
   - Common commands: `cat`, `dd`, `dump`, `flash read`, etc.
   - Example (on a UART shell):
     ```
     # Common UART firmware dump commands
     dd if=/dev/mtd0 of=/tmp/flash.bin
     cat /dev/mtd0 > /tmp/flash.bin
     flash_read 0x8000000 0x100000 firmware.bin
     ```

3. **Network-based Extraction**
   - TFTP firmware transfers during boot
   - Exploiting update mechanisms
   - Intercepting OTA (Over-The-Air) updates

### Hardware-based Extraction

1. **Flash Chip Reading**
   - Connecting directly to storage chips (SPI, eMMC, etc.)
   - In-circuit reading vs. chip removal
   - Equipment needed: Flash readers, adapters, clips

2. **Example: SPI Flash Extraction with Flashrom**
   ```bash
   # Identify the chip
   flashrom -p ch341a_spi

   # Read the entire flash content
   flashrom -p ch341a_spi -r firmware.bin

   # Verify with a second read
   flashrom -p ch341a_spi -r verify.bin
   
   # Compare the two reads
   md5sum firmware.bin verify.bin
   ```

3. **JTAG/SWD Based Extraction**
   - Connecting to debugging interfaces
   - Using OpenOCD, J-Link, or similar tools
   - Example with OpenOCD:
     ```bash
     # OpenOCD configuration and memory dump
     openocd -f interface/stlink.cfg -f target/stm32f1x.cfg -c "init" -c "halt" -c "dump_image firmware.bin 0x8000000 0x20000" -c "exit"
     ```

4. **Chip-Off Techniques**
   - Physically removing flash chips
   - Using specialized adapters and readers
   - Requires good soldering skills and proper equipment

### Invasive Extraction Methods

1. **Fault Injection**
   - Voltage glitching to bypass security
   - Clock manipulation
   - Example simple voltage glitcher:
     ```
     # Conceptual Arduino-based glitcher
     # Triggers a brief power interruption at specific timing
     digitalWrite(TRIGGER_PIN, HIGH);
     delayMicroseconds(PRECISE_TIMING);
     digitalWrite(TRIGGER_PIN, LOW);
     ```

2. **Side-Channel Attacks**
   - Power analysis during cryptographic operations
   - Electromagnetic emissions monitoring
   - Timing analysis of security operations

## Firmware Analysis Methodology

### Initial Assessment

1. **File Identification**
   - File type recognition: `file firmware.bin`
   - Header analysis: `hexdump -C firmware.bin | head -20`
   - Entropy analysis: `binwalk -E firmware.bin`

2. **Metadata Extraction**
   - Version information
   - Build dates and strings
   - Compiler information

3. **Binary Structure Analysis**
   - Partitioning and sections
   - File system identification
   - Compression detection

### Firmware Unpacking and Extraction

1. **Using Binwalk**
   ```bash
   # Basic scan
   binwalk firmware.bin
   
   # Automatic extraction
   binwalk -e firmware.bin
   
   # Recursive extraction (extract files within extracted files)
   binwalk -eM firmware.bin
   ```

2. **File System Extraction**
   - Mounting extracted file systems
   - Loop devices and FUSE methods
   - Example mounting extracted squashfs:
     ```bash
     sudo mount -t squashfs -o loop filesystem.squashfs /mnt/squashfs
     ```

3. **Custom Formats and Encryption**
   - Identifying proprietary formats
   - Locating encryption keys in hardware
   - Developing custom extraction scripts

### Static Analysis Techniques

1. **Binary Analysis Tools**
   - Ghidra, IDA Pro, or Radare2 for disassembly
   - Firmware-mod-kit for router firmware
   - Strings analysis: `strings -a -t x firmware.bin | grep -i password`

2. **Architecture Identification**
   - CPU architecture detection
   - Endianness determination
   - Instruction set analysis

3. **Code Analysis Patterns**
   - Identifying security functions
   - Locating authentication routines
   - Finding encryption implementations

4. **Example Ghidra Analysis Session**
   ```
   # Common Ghidra workflow
   1. Create new project
   2. Import binary
   3. Select appropriate processor architecture
   4. Allow auto-analysis to complete
   5. Explore functions and strings
   6. Annotate key findings
   ```

### Dynamic Analysis Options

1. **Firmware Emulation**
   - QEMU for full system emulation
   - Unicorn Engine for specific code sections
   - Example QEMU command for ARM firmware:
     ```bash
     qemu-system-arm -M virt -kernel firmware.bin -nographic
     ```

2. **Hardware-in-the-Loop Testing**
   - Testing modified firmware on actual hardware
   - Debugging with live system access
   - Monitoring system behavior during execution

3. **Hardware Debugging Setups**
   - JTAG/SWD connections during firmware execution
   - Breakpoints and memory inspection
   - Tracing execution flow

## Common Firmware Security Issues

1. **Hardcoded Credentials**
   - Default usernames and passwords
   - API keys and tokens
   - Example search command:
     ```bash
     grep -r "password\|pwd\|user\|auth\|key\|token" extracted_firmware/
     ```

2. **Insecure Boot Process**
   - Lack of signature verification
   - Vulnerable authentication mechanisms
   - Modifiable boot parameters

3. **Backdoors and Debug Features**
   - Hidden administrative interfaces
   - Undocumented commands
   - Testing/development features left enabled

4. **Encryption Weaknesses**
   - Weak algorithms or implementations
   - Hardcoded encryption keys
   - Key derivation vulnerabilities

5. **Update Mechanisms**
   - Unverified update acceptance
   - Insecure transport of updates
   - Downgrade vulnerabilities

## Firmware Modification Techniques

### Identifying Modification Points

1. **Locating Target Functions**
   - Security checks and authentication routines
   - Feature enablement flags
   - Access control implementations

2. **Binary Diffing**
   - Comparing different firmware versions
   - Identifying security patches
   - Using tools like Diaphora or BinDiff

### Modification Methods

1. **Binary Patching**
   - Changing specific bytes in the binary
   - Modifying conditional jumps
   - Example hex editing command:
     ```bash
     # Change byte at offset 0x1234 from 0x01 to 0x00
     printf '\x00' | dd of=firmware.bin bs=1 seek=$((0x1234)) count=1 conv=notrunc
     ```

2. **Building Modified Firmware**
   - Extracting, modifying, and repackaging
   - Creating custom firmware images
   - Handling checksums and signatures

3. **Runtime Modification**
   - Intercepting function calls through hooks
   - Modifying memory during execution
   - Using debugger to change execution flow

### Handling Firmware Protection

1. **Checksum Bypass**
   - Identifying checksum algorithms
   - Recalculating after modifications
   - Patching verification routines

2. **Signature Verification Bypass**
   - Finding verification routines
   - NOP-ing verification checks
   - Hardware-based bypass methods

## Case Studies in Firmware Analysis

### Case Study: Router Firmware Analysis

**Target**: Consumer Wi-Fi router

**Process**:
1. Download official firmware update
2. Extract filesystem with binwalk
3. Analyze startup scripts and configurations
4. Discover hardcoded credentials and insecure API
5. Identify command injection vulnerability in web interface

**Key Findings**:
- Default credentials stored in plaintext
- Insecure CGI scripts with command injection
- Disabled security features in configuration
- Backdoor access mechanism via undocumented API

### Case Study: IoT Device Firmware Security

**Target**: Smart home security camera

**Process**:
1. Extract firmware via SPI flash reading
2. Identify custom encryption routine for stored credentials
3. Reverse engineer authentication protocol
4. Find hardcoded master key in binary

**Key Findings**:
- Proprietary but weak encryption algorithm
- Master key allowing access to all devices of same model
- Unprotected debug interfaces with full system access
- Plaintext storage of Wi-Fi credentials

## Firmware Analysis Tools

### Essential Software Tools

1. **Extraction and Identification**
   - Binwalk: Firmware analysis and extraction tool
   - FirmWalker: Search for sensitive information
   - Firmware-mod-kit: Router firmware handling
   - Flashrom: Flash memory reading/writing

2. **Analysis Environments**
   - Ghidra: NSA's open-source reverse engineering tool
   - IDA Pro: Commercial disassembler and debugger
   - Radare2: Open-source reverse engineering framework
   - Binary Ninja: Modern disassembler with powerful analysis

3. **Emulation and Dynamic Analysis**
   - QEMU: Full system emulation
   - Unicorn Engine: Lightweight CPU emulator
   - Avatar²: Framework for dynamic firmware analysis

### Hardware Tools

1. **Flash Readers/Programmers**
   - CH341A programmer (inexpensive SPI flash tool)
   - DediProg SF100/SF600 (professional flash programmer)
   - Bus Pirate (versatile multi-protocol tool)

2. **Debug Adapters**
   - J-Link or ST-Link for ARM-based devices
   - XDS110 for TI devices
   - FT2232H-based adapters for versatile connections

## Practical Firmware Analysis Exercise

### Basic Firmware Analysis Walkthrough

**Equipment needed**:
- Computer with analysis tools installed (binwalk, strings, hexdump)
- Sample firmware image (can be downloaded from manufacturer websites)

**Procedure**:
1. Initial examination
   ```bash
   # Basic file identification
   file firmware.bin
   
   # View file header
   hexdump -C firmware.bin | head -20
   ```

2. Information gathering
   ```bash
   # Extract strings and look for interesting information
   strings -a -t x firmware.bin | grep -i -E "pass|user|key|config|admin"
   
   # Check entropy to identify compressed/encrypted sections
   binwalk -E firmware.bin
   ```

3. Firmware extraction
   ```bash
   # Scan for known signatures
   binwalk firmware.bin
   
   # Extract identified components
   binwalk -e firmware.bin
   ```

4. Filesystem analysis
   ```bash
   # Explore extracted filesystem
   find _firmware.bin.extracted -type f -exec file {} \;
   
   # Look for configuration files
   grep -r "password" _firmware.bin.extracted/
   ```

5. Document findings and potential vulnerabilities
   ```bash
   # Create report of findings
   echo "## Firmware Analysis Report" > report.md
   echo "- Firmware version: [version]" >> report.md
   echo "- Identified components: [list]" >> report.md
   echo "- Potential security issues: [issues]" >> report.md
   ```

## Conclusion

Firmware analysis is a cornerstone skill in hardware hacking, bridging the gap between hardware and software security. By extracting and analyzing firmware, hardware hackers can identify vulnerabilities, extract sensitive information, and modify device behavior in ways that may not be apparent from external interfaces alone.

The methods and tools covered in this section provide a foundation for exploring the internal workings of embedded devices, offering insights that are invaluable for comprehensive security assessment. As devices become more complex and security-conscious, the ability to extract and analyze firmware effectively will become an increasingly critical skill.

---

In the next section, we'll explore [Hardware Attack Vectors](./07-attack-vectors.md), covering the various approaches to exploiting hardware vulnerabilities.
