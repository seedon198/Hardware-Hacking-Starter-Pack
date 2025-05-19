# JTAG and SWD Protocols

JTAG (Joint Test Action Group) and SWD (Serial Wire Debug) are powerful debug interfaces that provide direct access to microcontrollers and processors. For hardware hackers, these protocols represent some of the most valuable attack surfaces for gaining deep system access.

## JTAG Fundamentals

### What is JTAG?

JTAG was originally developed for testing printed circuit boards but has evolved into the primary debugging and programming interface for processors, FPGAs, and other complex ICs.

### JTAG Key Features

- **Boundary Scan**: Test interconnections without physical probes
- **Debug Access**: Control CPU execution, set breakpoints, inspect registers/memory
- **Flash Programming**: Write to internal and external memory
- **Standardized**: IEEE 1149.1 standard (though many variations exist)
- **Chain Architecture**: Multiple devices can be daisy-chained

### JTAG Signal Lines

1. **TCK (Test Clock)**: Clock signal that synchronizes operations
2. **TMS (Test Mode Select)**: Controls the TAP state machine
3. **TDI (Test Data In)**: Serial data input to the device
4. **TDO (Test Data Out)**: Serial data output from the device
5. **TRST (Test Reset)**: Optional pin to reset the TAP controller
6. **GND**: Ground reference

## SWD (Serial Wire Debug)

### What is SWD?

SWD is ARM's alternative to JTAG, providing similar functionality with fewer pins. It's commonly found in modern ARM-based microcontrollers.

### SWD Key Features

- **Two-Wire Interface**: SWDIO (data) and SWCLK (clock)
- **ARM-specific**: Designed for ARM CoreSight debug architecture
- **Efficient**: Fewer pins than JTAG but similar functionality
- **Compatible**: Often implemented alongside JTAG in ARM processors

### SWD Signal Lines

1. **SWDIO**: Bidirectional data line
2. **SWCLK**: Clock signal
3. **GND**: Ground reference
4. **Optional SWO**: Serial Wire Output for trace data

## Identifying JTAG/SWD Interfaces

### Visual Identification

1. **Standard headers**: 10, 14, or 20-pin headers (various pinouts)
2. **Labeled pins**: JTAG, TDI, TDO, TCK, TMS, SWDIO, SWCLK
3. **Test points**: Often arranged in a specific pattern
4. **Unpopulated headers**: Look for silkscreen labels or pin arrangements

### JTAG/SWD Discovery Techniques

1. **Visual inspection**: Look for standard pinouts and test points
2. **Multimeter continuity**: Trace connections from processor pins
3. **JTAG finders**: Tools like JTAGulator, JTAGenum
4. **Automated scanning**: Software to identify likely JTAG/SWD pins

## Hardware for JTAG/SWD Hacking

### Essential Tools

1. **JTAG/SWD adapter**: J-Link, ST-Link, Black Magic Probe, etc.
2. **JTAG discovery tools**: JTAGulator, Arduino with JTAGenum
3. **Logic analyzer**: For monitoring JTAG/SWD traffic
4. **Breakout adapters**: For connecting to various header formats
5. **Jumper wires**: For connecting to test points

### Software Tools

1. **OpenOCD**: Open On-Chip Debugger
2. **gdb**: GNU Debugger for interacting with the target
3. **Vendor tools**: ARM debuggers, vendor-specific IDE plugins
4. **Custom scripts**: For specific JTAG/SWD operations
5. **URJTAG**: Universal JTAG library and tools

## JTAG/SWD Hacking Techniques

### Interface Discovery

1. **Pin identification**: Locate JTAG/SWD signals on the board
   - **JTAGulator approach**: Automated testing of pin combinations
   - **Manual approach**: Testing with multimeter and logic analyzer
   - **IDCODE scanning**: Finding valid JTAG device IDs

2. **Example with JTAGenum on Arduino**:
   ```c
   // Set arrays of pins to test
   int tck_pins[] = {2, 3, 4, 5};  // Potential TCK pins
   int tms_pins[] = {6, 7, 8, 9};  // Potential TMS pins
   int tdo_pins[] = {10, 11, 12};  // Potential TDO pins
   int tdi_pins[] = {14, 15, 16};  // Potential TDI pins
   // JTAGenum will test combinations of these pins
   ```

### Debug Access Exploitation

1. **Memory inspection**: Read sensitive data from memory
2. **Register manipulation**: Change processor state
3. **Code execution**: Run arbitrary code on the target
4. **Breakpoint insertion**: Analyze execution at specific points
5. **Flash memory operations**: Read or modify firmware

### Example OpenOCD Commands

```bash
# Connect to target using FTDI-based adapter
openocd -f interface/ftdi/ft232h-module-gpio.cfg -f target/stm32f4x.cfg

# In telnet session (port 4444)
> halt                       # Stop CPU execution
> dump_image firmware.bin 0x08000000 0x80000  # Extract flash memory
> flash write_image erase modified_firmware.bin 0x08000000  # Write modified firmware
> reg                        # Display CPU registers
> mww 0x20000000 0x12345678  # Write to memory address
> mdw 0x20000000 10          # Read 10 words from memory
> bp 0x0800522 2 hw         # Set hardware breakpoint
```

## Common Security Issues with Debug Interfaces

1. **Enabled debug access**: Production devices with active JTAG/SWD
2. **Insufficient protection**: Weak or disabled debug security features
3. **Exposed test points**: Easily accessible debug interfaces
4. **Bypassed fuses**: Security fuses that can be circumvented
5. **Debug password extraction**: Recovering passwords from previous sessions

## Advanced JTAG/SWD Attacks

### Debug Security Bypass

1. **Voltage glitching**: Manipulating power during security checks
2. **Clock manipulation**: Disrupting timing to bypass protections
3. **Fault injection**: Causing computational errors to skip validation
4. **Cold boot attacks**: Preserving memory contents for analysis

### Hardware-Based Attacks

1. **Silicon modification**: Physical attacks on the die
2. **Microprobing**: Direct connection to silicon traces
3. **Focused Ion Beam (FIB)**: Modifying chip interconnects
4. **Side-channel analysis**: Timing, power, or EM emissions analysis

## Practical JTAG/SWD Hacking Exercise

### Extracting Firmware via SWD

**Equipment needed:**
- Target device with ARM processor
- ST-Link v2 or similar SWD adapter
- Jumper wires
- Computer with OpenOCD and GDB

**Procedure:**
1. Identify SWD pins on the target (SWDIO, SWCLK, GND, optional VCC)
2. Connect ST-Link to the target device
3. Create an OpenOCD configuration file for your target
4. Start OpenOCD with appropriate interface and target files
5. Connect GDB to OpenOCD and halt the processor
6. Dump the flash memory contents
7. Analyze the extracted firmware

**Example OpenOCD and GDB commands:**
```bash
# Start OpenOCD
openocd -f interface/stlink.cfg -f target/stm32f1x.cfg

# In another terminal, start GDB
arm-none-eabi-gdb

# In GDB
(gdb) target remote localhost:3333
(gdb) monitor reset halt
(gdb) dump memory firmware.bin 0x08000000 0x08020000
(gdb) quit
```

## Securing Debug Interfaces

As a hardware hacker, understanding protective measures helps identify weaknesses:

1. **Debug disable fuses**: Permanently disable debug access
2. **Debug authentication**: Require password/key to access debug features
3. **Physical protection**: Bury or remove debug traces in production
4. **Limited debug functionality**: Restrict what can be accessed via debug
5. **Secure boot**: Ensure debug cannot bypass secure boot process

## Conclusion

JTAG and SWD interfaces represent some of the most powerful entry points for hardware hackers. These debug protocols often provide unrestricted access to memory, registers, and execution control, making them primary targets for security assessment.

Understanding how to locate, connect to, and leverage these interfaces is a critical skill for hardware hackers. The deep system access they provide can reveal security vulnerabilities or bypass protections that would be inaccessible through other means.

In the next section, we'll explore [USB Protocol](./05e-usb-protocol.md), which presents different security challenges as an external interface.
