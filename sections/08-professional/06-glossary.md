# Glossary of Hardware Hacking Terms

This glossary provides definitions for specialized terminology used throughout the Hardware Hacking Starter Pack. Technical terms are organized alphabetically with cross-references to related concepts and relevant guide sections where applicable.

## A

**Address Bus**  
The set of signal lines that carry memory addresses from the processor to memory and I/O devices, determining which location is being accessed.

**ADC (Analog-to-Digital Converter)**  
A circuit that converts continuous analog signals into discrete digital values, essential for capturing real-world measurements in digital systems.

**ASLR (Address Space Layout Randomization)**  
A security technique that randomly arranges the address space positions of key data areas in a process's memory, making memory exploitation more difficult.

**Assembler**  
A program that translates assembly language into machine code executable by a processor.

**Assembly Language**  
A low-level programming language with a strong correspondence between the language's instructions and machine code instructions, specific to a particular computer architecture.

## B

**Backdoor**  
An undocumented method of accessing a system or device that bypasses normal authentication mechanisms, sometimes intentionally implemented by manufacturers.

**Bit-banging**  
A technique for serial communications using software to directly manipulate I/O pins rather than dedicated hardware, often used when standard interfaces aren't available.

**Black Box Testing**  
Security testing conducted without knowledge of internal system structure, focusing on inputs and outputs.

**Bootloader**  
A small program that loads during the startup process before the operating system, often providing a target for hardware hackers due to its privileged position.

**Boundary Scan**  
A method for testing printed circuit boards after manufacture, utilizing a standardized interface (commonly JTAG) to verify connections between components.

**Bridge**  
A connection (often unintentional) between two conductors that should not be connected, creating a potential security vulnerability or malfunction.

**Brute Force Attack**  
A cryptographic attack that attempts all possible keys or passwords until the correct one is found.

**Bus**  
A communication system that transfers data between components inside a computer or between computers, including address buses, data buses, and control buses.

## C

**CAN (Controller Area Network)**  
A robust vehicle bus standard designed for microcontrollers and devices to communicate without a host computer, commonly used in automotive applications.

**ChipWhisperer**  
An open-source hardware security analysis platform that enables side-channel power analysis and glitching attacks on embedded systems.

**Clock**  
A signal used to coordinate actions of digital circuits, determining the speed at which operations occur.

**Cold Boot Attack**  
A process where an attacker with physical access to a computer recovers encryption keys from memory after powering down the system.

**Core Dump**  
A recorded state of the working memory of a computer program at a specific time, typically when the program has terminated abnormally (crashed).

**Cryptographic Accelerator**  
Specialized hardware that performs cryptographic operations more efficiently than general-purpose processors.

**Crystal Oscillator**  
An electronic oscillator circuit that uses the mechanical resonance of a vibrating crystal to create an electrical signal with a precise frequency, used as a clock signal.

## D

**DAC (Digital-to-Analog Converter)**  
A circuit that converts digital data into analog signals, used in generating controlled voltage levels and waveforms.

**Data Bus**  
The set of signal lines used for transferring data between the processor, memory, and peripheral devices in a computer system.

**Debug Header**  
A set of pins on a PCB providing access to debugging functions, often a primary target for hardware hackers seeking system access.

**Decapsulation**  
The process of removing the packaging material from an integrated circuit to expose the silicon die, typically used for advanced analysis or attacks.

**DEF CON**  
One of the world's largest hacker conventions, held annually in Las Vegas, featuring hardware hacking villages and competitions.

**DFT (Design for Testing)**  
Hardware design approaches that make testing easier, often providing attack surfaces for hardware hackers.

**DMA (Direct Memory Access)**  
A feature allowing hardware subsystems to access main system memory independently of the CPU, potentially creating security vulnerabilities.

**DMZ (Demilitarized Zone)**  
A physical or logical subnetwork that separates a local area network from other untrusted networks, often used in network security.

## E

**EEPROM (Electrically Erasable Programmable Read-Only Memory)**  
Non-volatile memory used in computers and other electronic devices to store small amounts of data that must be saved when power is removed.

**EMI (Electromagnetic Interference)**  
Disturbance that affects electrical circuits due to electromagnetic radiation emitted from an external source, potentially revealing operational secrets through side channels.

**Embedded System**  
A computer system with a dedicated function within a larger mechanical or electrical system, typically with real-time computing constraints.

**Emulator**  
Hardware or software that enables one computer system to behave like another, often used for running firmware in a controlled environment during analysis.

**Encryption**  
The process of encoding information so that only authorized parties can access it.

**Entropy**  
A measure of randomness or unpredictability, important in cryptographic systems and firmware analysis.

**EPROM (Erasable Programmable Read-Only Memory)**  
A type of memory chip that retains its data when its power supply is switched off but can be erased by exposing it to strong ultraviolet light.

## F

**Fault Injection**  
A technique for testing system security by deliberately introducing faults to reveal how the system responds to errors.

**FCC ID**  
A unique identifier assigned to products subject to Federal Communications Commission certification, often providing a starting point for research due to publicly available test reports.

**FPGA (Field-Programmable Gate Array)**  
An integrated circuit designed to be configured after manufacturing, often used for hardware hacking tools and custom security implementations.

**Firmware**  
Software that provides low-level control for a device's specific hardware, often a primary target for hardware security analysis.

**Flash Memory**  
Non-volatile memory that can be electrically erased and reprogrammed, commonly used to store firmware in embedded devices.

**Forensics**  
The application of scientific methods to investigate systems or devices, often used to analyze hardware for evidence of tampering or unauthorized access.

**JTAG Fuse**  
A mechanism to permanently disable JTAG access, often implemented as a physical fuse that can be blown after manufacturing to improve security.

## G

**Gate**  
The basic building block of digital circuits, implementing a logical function like AND, OR, or NOT.

**Glitching**  
Intentionally disrupting a system's normal operation, typically by manipulating power, clock, or other signals to induce errors that might bypass security.

**Ground**  
The reference point in an electrical circuit from which voltages are measured, often providing a common return path for electric current.

**GSM (Global System for Mobile Communications)**  
A standard developed to describe the protocols for second-generation digital cellular networks, relevant for mobile hardware hacking.

## H

**H-Bridge**  
An electronic circuit that enables voltage to be applied across a load in either direction, commonly used in motor control.

**Hackathon**  
An event where people engage in collaborative computer programming, often including hardware hacking challenges.

**Hardware Debugger**  
A tool that allows monitoring and controlling the execution of a program on the target hardware, essential for hardware security research.

**Hardware Security Module (HSM)**  
A physical computing device that safeguards and manages digital keys, performs encryption/decryption functions, and provides strong authentication.

**Hardware Trojan**  
A malicious modification to an electronic circuit that causes a system to provide unauthorized functionality or access.

**HEX File**  
A file format that contains hexadecimal values representing machine language code or data, commonly used for programming firmware.

## I

**I²C (Inter-Integrated Circuit)**  
A synchronous, multi-master, multi-slave, packet-switched, single-ended, serial communication bus commonly used for attaching lower-speed peripheral ICs to processors and microcontrollers.

**ICE (In-Circuit Emulator)**  
A hardware device used to debug embedded systems, providing direct access to processor states during execution.

**IDA Pro**  
A commercial disassembler and debugger widely used for software reverse engineering, including firmware analysis.

**IDS (Intrusion Detection System)**  
A system that monitors network traffic for suspicious activity and alerts administrators, sometimes including hardware components.

**In-System Programming (ISP)**  
The ability of a device to be programmed while installed in a complete system rather than requiring removal for programming.

**IoT (Internet of Things)**  
The network of physical objects embedded with sensors, software, and other technologies for the purpose of connecting and exchanging data with other devices and systems over the Internet.

**ISA (Instruction Set Architecture)**  
The part of the computer architecture related to programming, including the native data types, instructions, registers, addressing modes, memory architecture, etc.

## J

**JTAG (Joint Test Action Group)**  
A standardized interface for testing and debugging integrated circuits after manufacture, often providing privileged access targeted by hardware hackers.

**JTAGulator**  
An open-source hardware tool designed to assist in identifying on-chip debug (OCD) interfaces from test points, vias, or component pads on a target device.

**Jitter**  
The deviation from true periodicity of a presumably periodic signal, which can be exploited in certain timing attacks or may reveal operational information via side channels.

## K

**Kernel**  
The core component of an operating system that manages system resources, providing a layer between hardware and software applications.

**Keylogger**  
A hardware or software device that captures keystrokes, potentially compromising sensitive information like passwords.

**Kill Switch**  
A mechanism to shut down a device or system rapidly, sometimes implemented as a security feature.

## L

**LAN (Local Area Network)**  
A computer network that interconnects computers within a limited area such as a residence, school, or office building.

**LED (Light Emitting Diode)**  
A semiconductor light source that emits light when current flows through it, often used as status indicators that can reveal operational information.

**Logic Analyzer**  
An electronic instrument that captures and displays multiple signals from a digital system, essential for analyzing communication protocols.

**Logic Level**  
The voltage ranges used to represent logical states (typically high/low or 1/0) in digital circuits.

## M

**MAC Address (Media Access Control Address)**  
A unique identifier assigned to a network interface controller for use as a network address in communications within a network segment.

**Man-in-the-Middle Attack**  
An attack where the attacker secretly relays and possibly alters the communication between two parties who believe they are directly communicating with each other.

**MCU (Microcontroller Unit)**  
A small computer on a single integrated circuit containing a processor core, memory, and programmable input/output peripherals.

**Memory Dump**  
The process of extracting the contents of memory for analysis, revealing potential secrets or operational data.

**Memory Mapping**  
The process of translating virtual memory addresses to physical addresses in a computer system.

**MIPS (Microprocessor without Interlocked Pipeline Stages)**  
A reduced instruction set computer (RISC) instruction set architecture, common in embedded systems.

**MMU (Memory Management Unit)**  
A computer hardware component that handles memory access requests by translating virtual addresses to physical addresses.

## N

**NDA (Non-Disclosure Agreement)**  
A legal contract between parties that outlines confidential material or knowledge they may share but wish to restrict from wider use, often complicating hardware security research.

**Near Field Communication (NFC)**  
A set of communication protocols enabling two electronic devices to communicate within a short distance, commonly used in contactless payment systems and access control.

**Network Sniffer**  
A tool that intercepts and logs traffic passing over a digital network, useful for analyzing device communications.

**Non-Volatile Memory**  
Computer memory that can retrieve stored information even after having been power cycled, including flash memory, EEPROM, and storage drives.

**NOP (No Operation)**  
An assembly language instruction that does nothing, often used in software exploitation to create "NOP sleds" for memory attacks.

## O

**OCD (On-Chip Debugging)**  
Built-in hardware debugging features on integrated circuits, providing powerful capabilities for hardware hackers.

**Opcode (Operation Code)**  
The portion of a machine language instruction specifying the operation to be performed.

**OpenOCD**  
Open On-Chip Debugger, open-source software that interfaces with hardware debug tools to provide debugging, in-system programming, and boundary-scan testing.

**Oscilloscope**  
An instrument that graphically displays varying signal voltages as a function of time, essential for analyzing analog signals and timing relationships.

**OTP (One-Time Programmable)**  
Memory that can be programmed once and not erased, often used for storing security-critical parameters.

## P

**PCB (Printed Circuit Board)**  
A board that mechanically supports and electrically connects electronic components using conductive tracks, pads, and other features.

**PCI (Peripheral Component Interconnect)**  
A local computer bus for attaching hardware devices in a computer, with security implications when devices can access system memory directly.

**PCMCIA (Personal Computer Memory Card International Association)**  
An international standards body that defines and promotes standards for memory cards and interface technologies.

**PIC (Programmable Intelligent Computer)**  
A family of microcontrollers made by Microchip Technology, commonly found in embedded systems.

**PLC (Programmable Logic Controller)**  
An industrial digital computer adapted for the control of manufacturing processes, such as assembly lines or robotic devices.

**Port Scanning**  
The process of examining a network host for open ports, often used as a reconnaissance technique in network security.

**Power Analysis**  
A form of side-channel attack that exploits information about power consumption during device operation.

**Privilege Escalation**  
The act of exploiting a bug, design flaw, or configuration oversight in an operating system or application to gain elevated access to resources that are normally protected.

**PROM (Programmable Read-Only Memory)**  
A form of digital memory where the setting of each bit is locked by a fuse or antifuse, used for storing permanent data.

**Protocol Analyzer**  
A hardware device or software program that captures and analyzes data from digital communications.

**Proxy**  
An intermediary server that forwards requests from clients seeking resources to servers that provide those resources, sometimes used for analyzing encrypted communications.

## Q

**QFN (Quad Flat No-leads)**  
A surface-mount integrated circuit package with connections on four sides of the bottom surface, challenging to access for hardware hacking.

**QFP (Quad Flat Package)**  
An integrated circuit package with leads extending from all four sides, easier to access for hardware probing than QFN.

## R

**RAM (Random Access Memory)**  
Volatile computer memory that can be read and changed, used to store working data and machine code in a computer system.

**Raspberry Pi**  
A series of small single-board computers developed by the Raspberry Pi Foundation, widely used for hardware hacking projects.

**Reverse Engineering**  
The process of extracting knowledge or design information from a product and reproducing it based on the extracted information, central to hardware hacking.

**RF (Radio Frequency)**  
Any frequency within the electromagnetic spectrum associated with radio wave propagation, relevant for wireless device hacking.

**RFID (Radio-Frequency Identification)**  
Technology that uses electromagnetic fields to automatically identify and track tags attached to objects, a common target for security research.

**RMA (Return Merchandise Authorization)**  
The process of returning a product to receive a refund, replacement, or repair during the product's warranty period, sometimes providing access to devices for research.

**ROM (Read-Only Memory)**  
A type of non-volatile memory used in computers and other electronic devices that cannot be modified during normal operation.

**Root of Trust**  
A source that can always be trusted within a cryptographic system, typically implemented in hardware for embedded systems.

**ROP (Return-Oriented Programming)**  
A computer security exploit technique that allows an attacker to execute code in the presence of security defenses such as executable space protection and code signing.

**RSA (Rivest–Shamir–Adleman)**  
A public-key cryptosystem widely used for secure data transmission, sometimes implemented in hardware security modules.

## S

**SCADA (Supervisory Control and Data Acquisition)**  
A control system architecture that uses computers, networked data communications, and graphical user interfaces for high-level process supervisory management.

**Schematic**  
A diagram that represents the elements of a system using abstract, graphic symbols, essential for understanding hardware design.

**SDA (Serial Data Line)** and **SCL (Serial Clock Line)**  
The two signals used in I²C communication, common targets for eavesdropping on inter-chip communications.

**SDR (Software-Defined Radio)**  
A radio communication system where components traditionally implemented in hardware are instead implemented by means of software, widely used in wireless security research.

**Secure Boot**  
A security standard to ensure that a device boots using only software that is trusted by the manufacturer, often a target for circumvention in hardware hacking.

**Serial Number**  
A unique identifier assigned incrementally or sequentially to an item, often providing device tracking or authentication.

**SHA (Secure Hash Algorithm)**  
A cryptographic hash function that produces a fixed-size output from variable-size input, commonly implemented in hardware security modules.

**Shield**  
A barrier used to block electromagnetic fields, sometimes employed to prevent side-channel attacks or emissions.

**Shunt**  
A device that creates a low-resistance path for electric current to pass around another point in the circuit, used for current measurement in hardware analysis.

**Side-Channel Attack**  
An attack based on information gained from the implementation of a computer system, rather than weaknesses in the algorithm itself, such as monitoring power consumption or electromagnetic emissions.

**SigInt (Signal Intelligence)**  
The collection and analysis of signals, whether communications between people or from electronic emissions not directly used in communications.

**SMD (Surface-Mount Device)**  
An electronic component mounted directly onto the surface of a printed circuit board, typically smaller and harder to access than through-hole components.

**SMT (Surface-Mount Technology)**  
A method for producing electronic circuits where the components are mounted directly onto the surface of PCBs.

**Sniffing**  
Intercepting and logging traffic passing over a digital network or part of a network, used for analyzing device communications.

**SoC (System on a Chip)**  
An integrated circuit that integrates all components of a computer or other electronic system, increasingly common in modern devices.

**Social Engineering**  
The psychological manipulation of people into performing actions or divulging confidential information, sometimes used to obtain hardware or information for hacking.

**SPI (Serial Peripheral Interface)**  
A synchronous serial communication interface specification used for short-distance communication in embedded systems.

**SRAM (Static Random-Access Memory)**  
A type of random-access memory that holds data without needing to be refreshed, used in caches and registers.

**SSH (Secure Shell)**  
A cryptographic network protocol for operating network services securely over an unsecured network, often used to access embedded Linux systems.

**SSL/TLS (Secure Sockets Layer/Transport Layer Security)**  
Cryptographic protocols designed to provide communications security over a computer network, sometimes with hardware acceleration in devices.

**Stack**  
A data structure that stores information about the active subroutines of a computer program, often targeted in buffer overflow attacks.

**Startup Sequence**  
The series of steps a device performs when power is applied, often containing security-critical operations.

**Static Analysis**  
The analysis of computer software or hardware that is performed without actually executing the software/hardware, common in firmware analysis.

**Steganography**  
The practice of concealing a message within another message or a physical object, sometimes used to hide data within firmware images.

**SWD (Serial Wire Debug)**  
A two-pin electrical alternative to JTAG used for accessing ARM Cortex debug functionality.

## T

**TCB (Trusted Computing Base)**  
The set of all hardware, firmware, and software components critical to a system's security, the compromise of which could allow for a security policy to be violated.

**Teardown**  
The process of disassembling a device to examine its components and construction, often the first step in hardware hacking.

**Test Point**  
A designated location on a printed circuit board designed to allow testing equipment to make contact with the circuit, often providing access for hardware hackers.

**TPA (Test Point Access)**  
Dedicated points on a PCB designed for testing during manufacturing but useful for hardware hacking.

**TPM (Trusted Platform Module)**  
A specialized chip on an endpoint device that stores RSA encryption keys specific to the host system for hardware authentication.

**Trace**  
A conductive path on a printed circuit board, which can be followed to understand circuit connectivity.

**Transistor**  
A semiconductor device used to amplify or switch electronic signals and electrical power, the fundamental building block of modern electronic devices.

**TTL (Transistor-Transistor Logic)**  
A class of digital circuits built from bipolar junction transistors (BJT) and resistors, defining specific voltage levels used for logical states.

**TWI (Two Wire Interface)**  
Another name for the I²C communication protocol, involving only two wires for communication.

## U

**UART (Universal Asynchronous Receiver/Transmitter)**  
A computer hardware device for asynchronous serial communication in which the data format and transmission speeds are configurable, often providing console access to embedded systems.

**UEFI (Unified Extensible Firmware Interface)**  
A specification that defines a software interface between an operating system and platform firmware, replacing the legacy BIOS in modern computers.

**UID (Unique Identifier)**  
A numeric or alphanumeric string that is associated with a single entity within a given system, often used for device identification or authentication.

**USB (Universal Serial Bus)**  
An industry standard that establishes specifications for cables, connectors, and protocols for connection, communication, and power supply between computers and devices, a common attack surface.

## V

**Via**  
A small hole in a PCB connecting traces on different layers, sometimes providing access points for hardware probing.

**Voltage Glitching**  
A technique where the power supply of a target device is briefly disturbed to cause it to malfunction in a way that might bypass security checks.

**Voltage Level**  
The amplitude or magnitude of a voltage, important for interfacing with hardware and understanding signal characteristics.

**Volt-Ohm Meter (VOM)**  
An electronic measuring instrument that combines several measurement functions in one unit, including voltage, resistance, and current.

**Vulnerability**  
A weakness which can be exploited by a threat actor, such as an attacker, to perform unauthorized actions within a computer system or hardware device.

## W

**Wafer**  
A thin slice of semiconductor material used in the fabrication of integrated circuits, examined in advanced hardware analysis.

**White Box Testing**  
Security testing that is performed with complete knowledge of the internal structure and design of the system being tested.

**WiFi (Wireless Fidelity)**  
A family of wireless network protocols based on the IEEE 802.11 standards, commonly used for local area networking of devices.

**Wire Bonding**  
The method of making interconnections between an integrated circuit (IC) and its packaging during semiconductor device fabrication, visible after decapsulation.

**Wireshark**  
A free and open-source packet analyzer used for network troubleshooting, analysis, and security research.

## X

**XIP (Execute In Place)**  
A method of executing programs directly from long-term storage rather than copying it into RAM, common in embedded systems.

**XOR (Exclusive OR)**  
A logical operation that outputs true only when an odd number of inputs are true, commonly used in cryptography.

**X-ray Inspection**  
A non-destructive testing method that uses radiography to inspect internal components and connections in hardware, used in advanced hardware analysis.

## Y

**Yield**  
The percentage of properly working devices on a semiconductor wafer, affecting device cost and availability for research.

## Z

**Zero-Day Vulnerability**  
A previously unknown computer vulnerability that hackers can exploit before developers create a patch, applicable to hardware vulnerabilities.

**Zombie**  
A computer or device connected to the Internet that has been compromised by a hacker and can be used to perform malicious tasks, relevant to IoT device security.

**Z-Wave**  
A wireless communications protocol used primarily for home automation, a target for IoT security research.

---

## Navigation

**Section: Professional Development**

* Previous: [Project Ideas](05-project-ideas.md)
* [Back to Main Index](../../README.md)
