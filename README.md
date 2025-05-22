<div align="center">
<img src="./assets/header.svg" alt="Hardware Hacking Starter Pack" width="100%"/>
</div>

<div align="center">

<!-- Skill Level -->
<img src="https://img.shields.io/badge/Skill-Beginner_to_Advanced-black?style=for-the-badge" alt="Skill Level"/>

<!-- License -->
<img src="https://img.shields.io/github/license/seedon198/hardware-hacking-starter-pack?style=for-the-badge&color=black" alt="License: MIT"/>

<!-- Development Status -->
<img src="https://img.shields.io/badge/Status-Active_Development-black?style=for-the-badge&logo=github" alt="Development Status"/>

</div>



## Overview

Welcome to the **Hardware Hacking Starter Pack**! This comprehensive resource is designed to be your go-to guide for learning hardware security, from basic concepts to advanced techniques. Whether you're a cybersecurity professional looking to expand into hardware, an electronics enthusiast curious about security implications, or a student preparing for a career in security research, this guide provides the knowledge, methodologies, and practical exercises you need to succeed.

In today's interconnected world, hardware security has become increasingly critical. As more devices become **"smart"** and connected to networks, the attack surface expands beyond traditional software vulnerabilities to include hardware components. Understanding how to analyze, test, and secure hardware is an essential skill for comprehensive security assessment and protection.

## Why Hardware Hacking Matters

- **Security Research**: Discover vulnerabilities before malicious actors can exploit them
- **Product Development**: Build more secure devices from the ground up
- **Penetration Testing**: Expand your testing capabilities beyond software
- **Personal Growth**: Develop a deeper understanding of the technology we use daily
- **Career Advancement**: Specialized hardware security skills are in high demand

## Directory Organization

This Hardware Hacker Starter Pack is organized into a logical folder structure to help you find content more easily:

```ansi
📁 sections/
├── 🧠 01-foundations/             — Core knowledge for hardware security  
├── 🔌 02-communication-protocols/ — Hardware interfaces and protocols  
│   ├── ⚙️  wired/                 — Physical connection protocols  
│   └── 📡 wireless/               — RF and wireless communication  
├── 🔍 03-firmware/                — Firmware analysis techniques  
├── 💣 04-attack-vectors/          — Hardware attack methodologies  
├── 🕵️‍♂️ 05-reverse-engineering/     — Understanding unknown hardware  
├── 🔐 06-embedded-security/       — Securing embedded systems  
├── 📱 07-specialized-domains/     — Mobile and IoT security  
└── 🧑‍💼 08-professional/            — Career development resources  
```

## Content Overview

<style>
  /* GitHub Dark Theme Styling */
  body {
    background-color: #0d1117;
    color: #c9d1d9;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  }

  a {
    color: #58a6ff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #e6edf3;
    font-weight: 600;
  }

  code, pre {
    background-color: #161b22;
    border-radius: 6px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }

  /* GitHub Dark Theme Table */
  .glass-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 6px;
    overflow: hidden;
    color: #c9d1d9;
    font-size: 14px;
    margin: 16px 0;
    border: 1px solid #30363d;
    background-color: #0d1117;
  }

  .glass-table th,
  .glass-table td {
    padding: 8px 16px;
    border: 1px solid #30363d;
  }

  .glass-table thead {
    background-color: #161b22;
  }

  .glass-table th {
    font-weight: 600;
    color: #e6edf3;
  }

  .glass-table tbody tr {
    background-color: #0d1117;
  }

  .glass-table tbody tr:nth-child(even) {
    background-color: #161b22;
  }

  .glass-table tbody tr:hover {
    background-color: #1f2937;
  }

  .glass-table a {
    color: #58a6ff;
    font-weight: 600;
  }

  .glass-table td strong {
    color: #ff7b72;
  }

  /* Difficulty level colors */
  .difficulty-beginner {
    color: #7ee787;
    font-weight: 600;
  }

  .difficulty-intermediate {
    color: #ffa657;
    font-weight: 600;
  }

  .difficulty-advanced {
    color: #ff7b72;
    font-weight: 600;
  }

  .difficulty-all {
    color: #d2a8ff;
    font-weight: 600;
  }
  
  /* Topic column styling - ensure all topic cells in the second column are blue */
  .glass-table tbody tr td:nth-child(2) {
    color: #79c0ff !important;
    font-weight: 500;
  }
</style>

<table class="glass-table">
  <thead>
    <tr>
      <th>Category</th>
      <th>Topics</th>
      <th>Description</th>
      <th>Key Contents</th>
      <th>Difficulty</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4"><strong>📚<br>Foundations</strong></td>
      <td><a href="./sections/01-foundations/01-introduction.md">Introduction</a></td>
      <td class="topic-column">Core concepts and mindset</td>
      <td>Hardware security fundamentals, threat models, approaches</td>
      <td><span class="difficulty-beginner">Beginner</span></td>
    </tr>
    <tr>
      <td><a href="./sections/01-foundations/02-lab-setup.md">Lab Setup</a></td>
      <td class="topic-column">Workspace setup</td>
      <td>Safety, organization, equipment selection, budget considerations</td>
      <td><span class="difficulty-beginner">Beginner</span></td>
    </tr>
    <tr>
      <td><a href="./sections/01-foundations/03-tools-equipment.md">Tools & Equipment</a></td>
      <td class="topic-column">Hardware essentials</td>
      <td>Multimeters, oscilloscopes, logic analyzers, soldering tools</td>
      <td><span class="difficulty-beginner">Beginner</span></td>
    </tr>
    <tr>
      <td><a href="./sections/01-foundations/04-basic-electronics.md">Basic Electronics</a></td>
      <td class="topic-column">Electrical fundamentals</td>
      <td>Components, circuits, schematics, power considerations</td>
      <td><span class="difficulty-beginner">Beginner</span></td>
    </tr>
  <!-- Communication Protocols -->
  <tr>
    <td rowspan="1"><strong>📡<br>Communication<br>Protocols</strong></td>
    <td><a href="./sections/02-communication-protocols/index.md"><strong>Protocol Overview</strong></a></td>
    <td class="topic-column">Communication basics</td>
    <td>Protocol selection, analysis methodology, common tools</td>
    <td><span class="difficulty-beginner">Beginner</span></td>
  </tr>
  
  <!-- Communication Protocols - Wired -->
  <tr>
    <td rowspan="6"><strong>🔌<br>Wired<br>Protocols</strong></td>
    <td><a href="./sections/02-communication-protocols/wired/01-uart-protocol.md"><strong>UART</strong></a></td>
    <td class="topic-column">Serial communication</td>
    <td>Baud rates, signal levels, debugging interfaces, console access</td>
    <td><span class="difficulty-beginner">Beginner</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wired/02-i2c-protocol.md"><strong>I²C</strong></a></td>
    <td class="topic-column">Two-wire interface</td>
    <td>Address space, bus arbitration, sensor interfaces, sniffing</td>
    <td><span class="difficulty-beginner">Beginner</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wired/03-spi-protocol.md"><strong>SPI</strong></a></td>
    <td class="topic-column">Synchronous serial</td>
    <td>Clock synchronization, chip select, flash memory interfaces</td>
    <td><span class="difficulty-beginner">Beginner</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wired/04-jtag-swd.md"><strong>JTAG/SWD</strong></a></td>
    <td class="topic-column">Debug interfaces</td>
    <td>Boundary scan, debugging protocols, memory access, code extraction</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wired/05-usb-protocol.md"><strong>USB</strong></a></td>
    <td class="topic-column">Universal Serial Bus</td>
    <td>USB versions, device classes, packet analysis, USB attacks</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wired/06-ethernet-protocols.md"><strong>Ethernet</strong></a></td>
    <td class="topic-column">Network communication</td>
    <td>Physical layer, packet structure, analysis techniques</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  
  <!-- Communication Protocols - Wireless -->
  <tr>
    <td rowspan="7"><strong>📡<br>Wireless<br>Protocols</strong></td>
    <td><a href="./sections/02-communication-protocols/wireless/index.md"><strong>Wireless Overview</strong></a></td>
    <td class="topic-column">RF communication basics</td>
    <td>Spectrum analysis, wireless security principles</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wireless/01-rf-fundamentals.md"><strong>RF Fundamentals</strong></a></td>
    <td class="topic-column">Radio basics</td>
    <td>Frequencies, modulation, antennas, signal analysis</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wireless/02-wifi.md"><strong>WiFi</strong></a></td>
    <td class="topic-column">Wireless networking</td>
    <td>802.11 standards, authentication, encryption, attacks</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wireless/03-bluetooth.md"><strong>Bluetooth</strong></a></td>
    <td class="topic-column">Short-range wireless</td>
    <td>Pairing, BLE, sniffing, security vulnerabilities</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wireless/04-zigbee.md"><strong>Zigbee</strong></a></td>
    <td class="topic-column">Mesh networking</td>
    <td>Network structure, smart home applications, security analysis</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wireless/05-lora-lpwan.md"><strong>LoRa/LPWAN</strong></a></td>
    <td class="topic-column">Long-range protocols</td>
    <td>Low-power design, IoT applications, security considerations</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  <tr>
    <td><a href="./sections/02-communication-protocols/wireless/06-rfid-nfc.md"><strong>RFID/NFC</strong></a></td>
    <td class="topic-column">Contactless systems</td>
    <td>Reader/tag interaction, card cloning, access control systems</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  
  <!-- Firmware -->
  <tr>
    <td rowspan="1"><strong>💾<br>Firmware</strong></td>
    <td><a href="./sections/03-firmware/01-firmware-analysis.md"><strong>Firmware Analysis</strong></a></td>
    <td class="topic-column">Code extraction & review</td>
    <td>Extraction methods, binary analysis, vulnerability research</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  
  <!-- Attack Vectors -->
  <tr>
    <td rowspan="6"><strong>🛠️<br>Attack<br>Vectors</strong></td>
    <td><a href="./sections/04-attack-vectors/index.md"><strong>Attack Overview</strong></a></td>
    <td class="topic-column">Vulnerability types</td>
    <td>Attack methodologies, risk assessment, hardware threats</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/04-attack-vectors/01-physical-access.md"><strong>Physical Access</strong></a></td>
    <td class="topic-column">Direct hardware attacks</td>
    <td>Tamper techniques, bus snooping, memory extraction</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/04-attack-vectors/02-side-channel.md"><strong>Side-Channel</strong></a></td>
    <td class="topic-column">Passive analysis</td>
    <td>Power analysis, EM emissions, timing attacks, acoustic analysis</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  <tr>
    <td><a href="./sections/04-attack-vectors/03-fault-injection.md"><strong>Fault Injection</strong></a> (<a href="./sections/04-attack-vectors/03-fault-injection-2.md">Part 2</a>)</td>
    <td class="topic-column">Glitching techniques</td>
    <td>Voltage glitching, clock manipulation, laser fault injection</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  <tr>
    <td><a href="./sections/04-attack-vectors/04-hardware-implants.md"><strong>Hardware Implants</strong></a></td>
    <td class="topic-column">Physical modifications</td>
    <td>Backdoor circuits, rogue devices, detection techniques</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  <tr>
    <td><a href="./sections/04-attack-vectors/05-supply-chain-1.md"><strong>Supply Chain</strong></a> (<a href="./sections/04-attack-vectors/05-supply-chain-2.md">Part 2</a>, <a href="./sections/04-attack-vectors/05-supply-chain-3.md">Part 3</a>)</td>
    <td class="topic-column">Manufacturing threats</td>
    <td>Component substitution, trojan circuits, counterfeit detection</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  
  <!-- Reverse Engineering -->
  <tr>
    <td rowspan="6"><strong>🔍<br>Reverse<br>Engineering</strong></td>
    <td><a href="./sections/05-reverse-engineering/index.md"><strong>RE Overview</strong></a></td>
    <td class="topic-column">Methodology basics</td>
    <td>Approach to unknown hardware, documentation techniques</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/05-reverse-engineering/01-re-fundamentals.md"><strong>RE Fundamentals</strong></a></td>
    <td class="topic-column">Core concepts</td>
    <td>Documentation methods, workflow, non-destructive analysis</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/05-reverse-engineering/02-pcb-analysis.md"><strong>PCB Analysis</strong></a></td>
    <td class="topic-column">Circuit board examination</td>
    <td>Visual inspection, layer analysis, tracing circuits</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/05-reverse-engineering/03-component-id.md"><strong>Component ID</strong></a></td>
    <td class="topic-column">Part identification</td>
    <td>IC marking schemes, package types, component databases</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/05-reverse-engineering/04-circuit-extraction.md"><strong>Circuit Extraction</strong></a></td>
    <td class="topic-column">Functional analysis</td>
    <td>Schematic recreation, circuit function analysis</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  <tr>
    <td><a href="./sections/05-reverse-engineering/05-advanced-techniques.md"><strong>Advanced Techniques</strong></a></td>
    <td class="topic-column">Specialized methods</td>
    <td>Decapsulation, microscopy, chip photography</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  
  <!-- Embedded Security -->
  <tr>
    <td rowspan="6"><strong>🔒<br>Embedded<br>Security</strong></td>
    <td><a href="./sections/06-embedded-security/index.md"><strong>Security Principles</strong></a></td>
    <td class="topic-column">Protective design</td>
    <td>Threat modeling, security architecture, defense in depth</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/06-embedded-security/01-secure-boot.md"><strong>Secure Boot</strong></a></td>
    <td class="topic-column">Trusted startup</td>
    <td>Root of trust, code signing, boot verification</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  <tr>
    <td><a href="./sections/06-embedded-security/02-memory-protection.md"><strong>Memory Protection</strong></a></td>
    <td class="topic-column">Data security</td>
    <td>Memory encryption, secure storage, anti-tampering</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  <tr>
    <td><a href="./sections/06-embedded-security/03-secure-communications.md"><strong>Secure Communications</strong></a></td>
    <td class="topic-column">Data transmission</td>
    <td>Crypto implementations, key management, secure protocols</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  <tr>
    <td><a href="./sections/06-embedded-security/04-physical-security.md"><strong>Physical Security</strong></a></td>
    <td class="topic-column">Tamper resistance</td>
    <td>Secure enclosures, tamper detection, protective measures</td>
    <td><span class="difficulty-intermediate">Intermediate</span></td>
  </tr>
  <tr>
    <td><a href="./sections/06-embedded-security/05-security-testing.md"><strong>Security Testing</strong></a></td>
    <td class="topic-column">Validation methods</td>
    <td>Test methodologies, security verification, penetration testing</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  
  <!-- Specialized Domains -->
  <tr>
    <td rowspan="2"><strong>📱<br>Specialized<br>Domains</strong></td>
    <td><a href="./sections/07-specialized-domains/01-mobile-hacking.md"><strong>Mobile Security</strong></a></td>
    <td class="topic-column">Phone/tablet hardware</td>
    <td>Baseband processors, secure elements, biometric systems</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  <tr>
    <td><a href="./sections/07-specialized-domains/02-iot-security.md"><strong>IoT Security</strong></a></td>
    <td class="topic-column">Connected devices</td>
    <td>Smart device security, cloud connections, privacy considerations</td>
    <td><span class="difficulty-advanced">Advanced</span></td>
  </tr>
  
  <!-- Professional Development -->
  <tr>
    <td rowspan="6"><strong>🚀<br>Professional<br>Development</strong></td>
    <td><a href="./sections/08-professional/01-learning-path.md"><strong>Learning Path</strong></a></td>
    <td class="topic-column">Skill progression</td>
    <td>Knowledge roadmap, learning strategies, skill assessment</td>
    <td><span class="difficulty-all">All Levels</span></td>
  </tr>
  <tr>
    <td><a href="./sections/08-professional/02-certifications.md"><strong>Certifications</strong></a></td>
    <td>Formal education</td>
    <td>Hardware security certifications, training programs, courses</td>
    <td><span class="difficulty-all">All Levels</span></td>
  </tr>
  <tr>
    <td><a href="./sections/08-professional/03-community-resources.md"><strong>Community</strong></a></td>
    <td class="topic-column">Knowledge sharing</td>
    <td>Forums, chat platforms, conferences, online resources</td>
    <td><span class="difficulty-all">All Levels</span></td>
  </tr>
  <tr>
    <td><a href="./sections/08-professional/04-legal-ethical.md"><strong>Legal & Ethics</strong></a></td>
    <td class="topic-column">Responsible practice</td>
    <td>Legal considerations, responsible disclosure, ethics</td>
    <td><span class="difficulty-all">All Levels</span></td>
  </tr>
  <tr>
    <td><a href="./sections/08-professional/05-project-ideas.md"><strong>Project Ideas</strong></a></td>
    <td class="topic-column">Practical exercises</td>
    <td>Hands-on projects, skill-building activities, challenges</td>
    <td><span class="difficulty-all">All Levels</span></td>
  </tr>
  <tr>
    <td><a href="./sections/08-professional/06-glossary.md"><strong>Glossary</strong></a></td>
    <td class="topic-column">Terminology</td>
    <td>Hardware security terms, acronyms, concepts defined</td>
    <td><span class="difficulty-all">All Levels</span></td>
  </tr>
</table>

## Target Audience

This guide is designed for:

- **Security Professionals** looking to expand their skillset into hardware
- **Electronics Engineers** wanting to understand security implications
- **Computer Science Students** seeking specialized knowledge
- **Hobbyists and Makers** interested in the security aspects of their projects
- **Product Developers** aiming to build more secure devices

## Prerequisites

While this guide starts from foundational concepts, having some background in the following areas will be helpful:

- Basic understanding of electronics (Ohm's Law, simple circuits)
- Familiarity with a programming language (Python recommended)
- Comfort with command-line interfaces
- Problem-solving mindset and attention to detail

## How to Use This Guide

This resource is designed to be flexible for different learning styles and experience levels:

- **Sequential Learning**: Begin with section 1 and progress through in order for a comprehensive education
- **Topic-Based Exploration**: Jump to specific sections based on your immediate needs or interests
- **Practical Approach**: Each section includes hands-on exercises to reinforce concepts
- **Reference Material**: Use the glossary and specialized sections as lookup resources during projects

### Recommended Learning Paths

#### For Complete Beginners
1. Start with the **Foundations** section to build a solid foundation
2. Practice basic skills with the starter projects in the **Professional Development** section
3. Explore the **Communication Protocols** section with your new knowledge
4. Progress to **Firmware Analysis** when comfortable

#### For Electronics Engineers
1. Review the **Foundations** section to align your knowledge with security perspectives
2. Focus on **Attack Vectors**, **Embedded Security**, and **Legal & Ethics** to understand attack vectors and protections
3. Explore the **Reverse Engineering** techniques

#### For Software Security Professionals
1. Focus on the **Foundations** section to build electronics fundamentals
2. Pay special attention to the **Communication Protocols** section
3. Connect your software knowledge with **Firmware Analysis**, **Attack Vectors**, and **Embedded Security**

## Contributing

Contributions are welcome and encouraged! This project benefits from diverse perspectives and experiences. If you have suggestions, corrections, or content to add:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please also feel free to open issues for discussion or to report errors.

## Notice to Readers
```
I will have to admit that using AI to generate the images using ACII art 
was not the wisest of the choices. I will be working on a better version 
of this guide in the future, especialy the images. If you are good at 
creating images, illustrations or any other form of media, I can sure use 
your help. Please consider contributing to this project.
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Connect with the creator on [LinkedIn](https://www.linkedin.com/in/seedon/)
