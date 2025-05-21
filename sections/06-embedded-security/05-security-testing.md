# Security Testing and Vulnerability Assessment

The security of an embedded system isn't determined by what you put into it, but by what an attacker can't get out of it. Security testing and vulnerability assessment provide the crucial reality check that transforms theoretical security into practical protection.

## The Mindset Shift

Effective security testing requires a fundamental shift in perspective. As creators, we naturally focus on making things work correctly under expected conditions. As security testers, we must do the opposite—exploring how systems fail under unexpected conditions and deliberate manipulation.

I call this the "creative destruction" mindset. It's not enough to verify that a device functions when used as intended; we must actively try to make it misbehave in ways that compromise security. This approach can feel uncomfortable, especially for those who built the system, but it's essential for realistic security assessment.

The hardware hacker brings unique value to security testing by understanding both the digital and physical dimensions of embedded systems. While software security testers might focus on network protocols or application logic, hardware-focused testing explores the full attack surface—from chip packages to signal lines to power systems.

## Building a Testing Strategy

No single test or methodology can comprehensively assess embedded security. A strong testing strategy integrates multiple approaches:

**Black Box Testing** examines the device from an outsider's perspective, with no internal knowledge of its workings. This simulates the position of an attacker who acquired a device with no inside information.

**White Box Testing** leverages complete knowledge of the system—including schematics, source code, and design documents—to identify vulnerabilities that might be difficult to discover without this information.

**Gray Box Testing** falls between these extremes, using limited internal knowledge to guide testing while still maintaining some of the discovery aspects of black box approaches.

Each approach has unique strengths. Black box testing often reveals surprising vulnerabilities that designers never considered, while white box testing can efficiently pinpoint subtle issues in security-critical components. Most comprehensive assessments include elements of both.

A medical device company I advised found this hybrid approach invaluable—black box testing by red team consultants discovered an unexpected attack via the battery charging circuit, while white box review identified a cryptographic implementation flaw that would have been nearly impossible to discover through external testing alone.

## Scoping the Assessment

Before diving into testing techniques, we need to define what we're testing and why. Key scoping questions include:

- What assets are we protecting?
- Which threats are we concerned about?
- What level of attacker resources should we assume?
- Which parts of the system should receive the most scrutiny?

These considerations help focus testing efforts where they provide the most value. A consumer IoT device might prioritize testing of cloud communication security and basic tamper resistance, while a financial cryptographic module would demand exhaustive testing of side-channel leakage and penetration resistance.

The PASTA methodology (Process for Attack Simulation and Threat Analysis) provides a structured framework for this scoping process:

1. Define business objectives
2. Define technical scope
3. Decompose application
4. Analyze threats
5. Vulnerabilities and weaknesses
6. Attack enumeration
7. Risk analysis and prioritization

This methodical approach ensures testing addresses realistic threats aligned with business priorities.

## Hardware-Focused Testing Techniques


### Visual Inspection and Analysis

Never underestimate what careful examination can reveal. Visual inspection might identify:

* Unpopulated debug headers
* Test points connected to critical signals
* Component markings that reveal functionality
* PCB traces that bypass security mechanisms
* Evidence of design changes or modifications

Modern inspection often employs digital microscopy, ultraviolet illumination to reveal hidden markings, and X-ray imaging to see through packaging. These techniques can reveal surprises—like finding unpopulated JTAG headers in supposedly secure devices or identifying cryptographic accelerators from subtle package markings.

### Interface Identification and Analysis

Most embedded devices contain multiple interfaces—some obvious, others hidden. Identifying these interfaces is a critical first step in security assessment:

* **Standard interfaces**: USB, Ethernet, HDMI, etc.
* **Debugging interfaces**: JTAG, SWD, UART, etc.
* **Internal buses**: I²C, SPI, SDIO, etc.
* **Test interfaces**: Production test points, programming headers, etc.

For mysterious connectors or test points, a logical analyzer with protocol decoding capabilities proves invaluable. When combined with basic electronic tools like continuity testers and oscilloscopes, you can often map out connections and identify their purposes.

Once identified, each interface warrants specific testing:

For UART interfaces:
- Attempt to access debug consoles or bootloader prompts
- Identify whether authentication is required
- Test for command injection in interface parsing
- Observe boot messages for sensitive information

For debugging interfaces:
- Test whether debugging is disabled or restricted
- Attempt to read protected memory regions
- Check for readout protection enforcement
- Evaluate debug authentication mechanisms

I once assessed a home security system where the manufacturer had carefully secured the network interface with strong encryption and authentication—but left an unauthenticated UART port accessible via unpopulated test points. This port provided complete administrative access, bypassing all other security measures.

### Firmware Analysis

Extracting and analyzing firmware provides deep insights into potential vulnerabilities:

1. **Extraction methods**:
   - Reading from external flash
   - Capturing update files
   - Utilizing debug interfaces
   - Exploiting bootloader vulnerabilities

2. **Static analysis**:
   - Identifying hardcoded credentials
   - Locating cryptographic implementations
   - Finding security-critical code sections
   - Discovering backdoors or vulnerable functions

3. **Dynamic analysis**:
   - Setting breakpoints at security checks
   - Manipulating security-critical variables
   - Observing cryptographic operations
   - Testing input validation

The results often reveal surprising issues. During an assessment of an industrial controller, static analysis revealed an apparent backdoor—a hardcoded "maintenance password" that bypassed normal authentication. Further investigation showed this wasn't malicious but was deliberately added during development and accidentally left in the production firmware.

### Side-Channel Analysis

Side-channel analysis observes unintended information leakage during device operation:

***Power Analysis*** examines power consumption patterns during security operations. Differential Power Analysis (DPA) can reveal cryptographic keys by statistically analyzing power variations across multiple operations.

Simple power analysis setup:
```
Device Under Test --> Current Sensing Resistor --> Power Supply
                           |
                           v
                     Oscilloscope/Digitizer --> Analysis Computer
```

***Electromagnetic Analysis*** captures electromagnetic emissions using specialized probes. Like power analysis, these emissions often correlate with internal operations, potentially revealing sensitive information.

***Timing Analysis*** measures operation duration to identify data-dependent processing. Even slight timing differences can leak information about security operations.

These techniques have demolished theoretically secure implementations. A classic example involved a "secure" smartcard that leaked its private key through power consumption patterns during signature operations. The fix required redesigning the cryptographic implementation to ensure consistent power usage regardless of the key bits being processed.

### Fault Injection Techniques

Fault injection deliberately disrupts normal operation to induce security failures:

**Voltage Glitching** temporarily alters supply voltage to cause processing errors. A precisely timed voltage drop might cause a security check to be skipped or return an incorrect result.

**Clock Manipulation** interferes with timing signals, potentially causing instruction skips or misinterpretation.

**Electromagnetic Fault Injection** uses localized electromagnetic pulses to disturb specific circuit areas.

**Temperature Manipulation** operates devices outside their specified temperature range, potentially causing memory cells to retain data incorrectly or timing parameters to shift.

These techniques require precise control and often custom equipment. A voltage glitching setup might include:

* Microcontroller for precise timing control
* MOSFET switching circuit for voltage manipulation
* Triggering mechanism synchronized with the target operation
* Monitoring system to detect successful fault injection

While seemingly exotic, these techniques have proven effective against real-world targets. One manufacturer of payment terminals discovered their PIN verification could be bypassed with a precisely timed power glitch—allowing any PIN to be accepted as valid. The fix required redesigning the verification sequence and adding redundant checks.

### Invasive Analysis

The most advanced testing techniques physically modify the device:

**Decapsulation** removes packaging material to expose silicon die, enabling direct observation and interaction with the integrated circuit.

**Microprobing** uses extremely fine probes to contact internal circuit nodes, potentially reading sensitive signals directly from the silicon.

**Focused Ion Beam (FIB)** manipulation can modify circuits at the nanometer scale, altering security features or creating new connections.

**Reverse engineering** the complete circuit from silicon observation.

These techniques require specialized equipment and expertise but can defeat even sophisticated protections. They're commonly used in high-value targets where attackers have significant resources.

An example from the gaming industry illustrates their power—a game console manufacturer implemented multiple software and hardware protections in their security chip, but determined attackers used acid decapsulation and microprobing to extract the master key directly from the silicon. This prompted next-generation designs with active mesh sensors and encrypted buses even within the chip itself.

## Software Security Testing for Embedded Systems

While hardware aspects are crucial, software vulnerabilities often provide the easiest attack path. Key software testing approaches include:

### Fuzzing

Fuzzing sends malformed, unexpected, or random inputs to interfaces, looking for crashes or unintended behaviors:

1. **Protocol fuzzing** targets communication interfaces like Bluetooth, Wi-Fi, or custom protocols
2. **File format fuzzing** tests parsers for configuration files, firmware updates, etc.
3. **API fuzzing** examines internal programming interfaces
4. **Command fuzzing** tests command parsers on debug or management interfaces

Effective fuzzing requires:
- Understanding the expected input format
- Instrumentation to detect failures (crashes, hangs, etc.)
- Automation to generate and test many input variations
- Monitoring to capture the specific inputs that cause failures

A simple UART command fuzzer might look like:

```python
import serial
import random
import string
import time

# Open serial connection
ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)

# Generate random commands with varying characteristics
for i in range(10000):
    # Create command with random length, content, and special characters
    cmd_len = random.randint(1, 100)
    cmd = ''.join(random.choice(string.printable) for _ in range(cmd_len))
    
    # Send command and read response
    ser.write(cmd.encode() + b'\r\n')
    time.sleep(0.1)  # Allow device to process
    
    # Check if device is still responding
    ser.write(b'TEST\r\n')
    response = ser.read(100)
    
    if not response:
        print(f"Possible crash with command: {cmd!r}")
        # Wait for device to recover or manually reset
        time.sleep(5)
```

Even this simple approach can uncover buffer overflows, parser vulnerabilities, and command injection flaws.

### Binary Analysis

Binary analysis examines compiled firmware:

* **Static binary analysis** uses disassemblers and decompilers to examine code without execution
* **Dynamic analysis** runs code in emulation or on actual hardware with debugging
* **Symbolic execution** explores multiple code paths by treating inputs as symbolic values

For embedded systems, binary analysis often requires:
- Architecture-specific tools (ARM, MIPS, etc.)
- Understanding of memory-mapped peripherals
- Custom scripts for device-specific features

These techniques can identify vulnerabilities like buffer overflows, insecure cryptographic implementations, and authentication bypasses that might be difficult to find through external testing alone.

### Memory Corruption Testing

Memory corruption vulnerabilities remain common in embedded systems:

- **Buffer overflow testing** attempts to write beyond allocated buffers
- **Format string testing** exploits uncontrolled format specifiers
- **Integer overflow testing** looks for arithmetic errors affecting memory operations
- **Use-after-free scenarios** test temporal memory safety

Finding these issues typically combines static analysis tools, dynamic testing with crafted inputs, and code review.

## Comprehensive Testing Workflow

A thorough embedded security assessment typically progresses through phases:

**1. Reconnaissance and Planning**
- Gather documentation and publicly available information
- Identify interfaces and access points
- Develop testing strategy based on device type and risk profile

**2. Non-Destructive External Analysis**
- Visual inspection
- Interface identification
- Communication monitoring
- Basic functional testing

**3. Software Security Analysis**
- Firmware extraction and analysis
- Network protocol testing
- API and interface testing
- Authentication and authorization testing

**4. Hardware Security Analysis**
- Debug interface testing
- Side-channel analysis
- Fault injection attempts
- Memory extraction attempts

**5. Advanced Analysis (if warranted)**
- Custom tool development for specific vulnerabilities
- Decapsulation and microprobing
- Full hardware reverse engineering

**6. Reporting and Remediation**
- Clear vulnerability documentation
- Exploitation proof-of-concepts
- Realistic risk assessment
- Specific remediation recommendations

This phased approach ensures efficient use of testing resources, focusing deeper techniques on areas where initial analysis reveals potential weaknesses.

## Specialized Assessment Areas

Some embedded contexts require specialized testing approaches:

### Secure Boot Validation

Testing secure boot implementations requires verifying:

- Boot sequence integrity with modified components
- Signature verification effectiveness
- Downgrade prevention mechanisms
- Key storage security
- Debug interface protection during boot

Effective testing combines understanding the boot architecture with attempts to bypass or manipulate the verification process.

### Cryptographic Implementation Assessment

Cryptographic implementations warrant special attention:

- Algorithm selection appropriateness
- Key generation quality
- Key storage security
- Side-channel resistance
- Algorithm implementation correctness
- Random number generation quality

Testing might include formal verification of implementations, statistical analysis of outputs, and specific side-channel attacks targeting cryptographic operations.

### Supply Chain Security Assessment

Supply chain security considers:

- Component authenticity verification
- Counterfeit detection mechanisms
- Manufacturing process security
- Initial provisioning protection
- Hardware modification detection

This area often requires cooperation from manufacturers and suppliers to fully evaluate.

## Building a Test Lab

Effective hardware security testing requires appropriate equipment. A basic hardware security testing lab might include:

**Essential Equipment:**
- Digital multimeter
- Oscilloscope (ideally 100MHz+)
- Logic analyzer with protocol decoders
- Soldering and rework tools
- USB-based protocol adapters (UART, SPI, I2C, etc.)
- Power supply with current monitoring

**Specialized Tools:**
- JTAG/SWD debuggers for common architectures
- Flash readers for external memory
- Near-field electromagnetic probes
- Software-defined radio for wireless analysis
- Basic fault injection equipment

**Software Resources:**
- Disassemblers and decompilers
- Protocol analyzers
- Fuzzing frameworks
- Signal processing tools
- Custom scripts for specific testing needs

The specific equipment needed varies based on the devices being tested. Testing medical devices might require different tools than automotive systems or consumer electronics.

## Case Study: IoT Camera Security Assessment

Let's consider a practical example—assessing an IP security camera:

**Initial Reconnaissance:**
The camera used a custom Linux-based firmware, exposed HTTP and RTSP interfaces, and included a mobile app for configuration. External markings identified the main SoC and flash memory.

**Non-Destructive Analysis:**
Visual inspection revealed unpopulated UART pins on the PCB. Connecting to these pins provided boot log access and a root shell without authentication. The flash memory chip was easily accessible for direct reading.

**Firmware Analysis:**
Extracting the firmware revealed:
- Hardcoded administrative credentials
- Unencrypted storage of Wi-Fi passwords
- Outdated software components with known vulnerabilities
- Unsigned firmware update mechanism

**Communication Security:**
Testing the device's network interfaces found:
- Unencrypted video streaming over local network
- Weak authentication for cloud connectivity
- Susceptibility to CSRF attacks in the web interface
- Command injection vulnerability in the DHCP client

**Physical Security:**
The device lacked meaningful physical protections:
- No secure boot implementation
- No protection against flash memory reading
- Debug interfaces fully enabled
- No tamper detection mechanisms

**Remediation Recommendations:**
1. Implement secure boot with signature verification
2. Enable flash encryption for sensitive data
3. Add authentication to debug interfaces
4. Update vulnerable components
5. Implement proper encryption for all communications
6. Remove hardcoded credentials
7. Add proper input validation for network interfaces

This assessment combined multiple testing techniques to build a comprehensive understanding of the device's security posture, revealing issues that no single approach would have found alone.

## Standardized Testing Methodologies

Several established methodologies provide structured approaches to embedded security testing:

**OWASP IoT Security Verification Standard (ISVS)** offers a comprehensive framework specifically for IoT devices, covering hardware, software, and communication security.

**NIST SP 800-115** (Technical Guide to Information Security Testing and Assessment) provides broader security testing guidance applicable to embedded systems.

**Common Criteria** evaluation includes standardized testing approaches based on the security level being certified, particularly relevant for high-security applications.

**FIPS 140-2/3** specifically addresses cryptographic module security, with detailed physical security testing requirements at higher security levels.

These methodologies help ensure comprehensive coverage and consistent results, particularly important when regulatory compliance is required.

## Ethical and Legal Considerations

Security testing walks a fine line between beneficial security improvement and potentially harmful activities. Key considerations include:

**Legal Authorization:**
- Ensure you have proper permission to test the device
- Understand applicable laws regarding reverse engineering
- Consider intellectual property implications
- Document authorization clearly before beginning

**Responsible Disclosure:**
- Follow established disclosure processes when finding vulnerabilities
- Provide manufacturers reasonable time to address issues
- Balance public safety concerns with disclosure timing
- Document communication attempts if vendors are unresponsive

**Testing Limitations:**
- Avoid testing that might damage production systems
- Consider safety implications before fault injection
- Preserve evidence of vulnerabilities
- Don't exceed the authorized scope of testing

The security community generally supports responsible security research conducted with proper authorization and disclosure practices.

## Continuous Security Assessment

Security testing isn't a one-time activity but should continue throughout a product's lifecycle:

**Pre-Release Testing:**
- Design reviews to identify architectural issues
- Component-level testing during development
- Integration testing of security subsystems
- Full-system penetration testing before release

**Post-Release Monitoring:**
- Tracking of new vulnerability disclosures in components
- Monitoring for similar product vulnerabilities
- Security researcher engagement programs
- Ongoing penetration testing for significant updates

**End-of-Life Considerations:**
- Planning for support termination
- Communication of security implications
- Data sanitization procedures
- Legacy compatibility issues

This lifecycle approach acknowledges that security threats evolve over time, requiring continuous attention throughout a product's existence.

## Conclusion

Security testing transforms theoretical security into practical protection by identifying where reality diverges from design. For embedded systems, comprehensive testing must address both hardware and software dimensions, considering the unique attack vectors that physical access enables.

Effective testing combines understanding of the system under test, knowledge of attack techniques, appropriate tools, and a creative mindset focused on finding the unexpected paths that attackers might exploit. No single technique or approach provides complete assurance—security emerges from the combination of multiple testing methods targeting different aspects of the system.

As embedded systems continue to proliferate in critical applications—from medical devices to automotive systems to infrastructure—security testing becomes increasingly essential. The hardware hacker's skillset is particularly valuable in this context, bringing together digital and physical security considerations in ways that purely software-focused approaches cannot match.

The ultimate goal of security testing is not finding vulnerabilities for their own sake, but improving security in ways that matter. By identifying and addressing issues before attackers exploit them, security testing helps create a more trustworthy ecosystem of embedded devices that users can rely on for years to come.

---

## Navigation

**Section: Embedded Security**

* Previous: [Physical Security](04-physical-security.md)
* Next: [Index](index.md)
* [Back to Main Index](../../README.md)
