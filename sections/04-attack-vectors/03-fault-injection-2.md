# Fault Injection Techniques (Part 2)

## Optical Fault Injection

Among the most precise fault injection methods available to hardware security researchers is optical fault injection. This technique uses focused light—typically from lasers—to induce localized currents within semiconductor materials. When photons with sufficient energy strike silicon, they create electron-hole pairs that can disrupt normal transistor operation.

The precision of optical fault injection is unmatched. With the right equipment, researchers can target individual transistors within a complex integrated circuit. This level of control makes it possible to create highly specific faults that affect exactly the operations an attacker wishes to manipulate.

Semiconductor laboratories often use laser fault injection systems that include microscope optics, precise positioning stages, and specialized lasers with controlled pulse characteristics. The entire system might be mounted on vibration-isolated tables to ensure stability during targeting.

Preparing a chip for laser fault injection typically requires some level of decapsulation—removing the packaging material to expose the silicon die. This can be accomplished through mechanical means or chemical etching, depending on the package type. Once exposed, the die can be mapped and specific functional areas targeted.

Researchers at Cambridge University demonstrated the power of this technique by extracting cryptographic keys from secure microcontrollers that were designed to resist other forms of attack. Their work showed that even a relatively simple laser setup could defeat sophisticated protection mechanisms when applied with knowledge and precision.

While professional laser fault injection systems cost tens of thousands of dollars, researchers have created proof-of-concept attacks using modified Blu-ray optical assemblies and other consumer components. As technology advances, these techniques become increasingly accessible to security researchers with modest budgets.

## Temperature Manipulation

Temperature affects semiconductor behavior in profound ways. By pushing a device outside its rated temperature range, an attacker can induce computational errors or bypass security mechanisms. Unlike the previous techniques that target specific operations with precise timing, temperature manipulation creates persistent fault conditions that can be exploited over longer periods.

Extreme cold (cryogenic temperatures) can dramatically alter memory retention characteristics. SRAM cells may maintain their state indefinitely without power, allowing cold boot attacks where memory contents remain accessible after power loss. Dynamic RAM refresh requirements change, potentially allowing extraction of data that would normally be lost.

At the other extreme, high temperatures can increase semiconductor leakage currents and change timing characteristics. This can lead to computational errors, particularly in devices operating near their performance limits. Overheating can also trigger throttling or protection mechanisms that might create new attack surfaces.

Temperature attacks have been demonstrated against various security systems. Research teams have frozen DRAM modules to preserve their contents, allowing extraction of encryption keys. Others have used targeted heating to trigger failures in protective circuits, creating pathways for additional attacks.

The equipment for temperature manipulation ranges from simple to complex:

For cold attacks, consumer-available freezing spray can rapidly cool small components, while dry ice or liquid nitrogen provides more sustained cooling. Advanced setups might use thermoelectric coolers or cryostats for precise temperature control.

Heat attacks can use focused hot air tools (like rework stations), infrared lamps, or custom heating elements placed near sensitive components. Some researchers have even used high-power lasers to create extremely localized heating.

These methods have practical implications for device security. A stolen device subjected to temperature extremes might yield secrets despite otherwise strong cryptographic protection. Devices in harsh environments might be more vulnerable to attacks that exploit temperature-induced behaviors.

## Body Biasing Attacks

Body biasing refers to manipulating the substrate voltage of semiconductor devices. In normal operation, the silicon substrate (or "body") of a transistor is kept at a fixed potential. By changing this potential, an attacker can alter transistor threshold voltages and switching characteristics.

This technique requires more invasive access to the chip than voltage glitching, but offers finer control over induced faults. It's particularly effective against devices fabricated using certain processes where the substrate is accessible or not completely isolated.

Security researchers have demonstrated that body biasing can be used to manipulate SRAM cells, alter cryptographic operations, and influence random number generation. In one notable example, researchers were able to bias the substrate of a secure element to influence the outcome of supposedly random operations, compromising the security of the entire system.

The equipment required for body biasing attacks typically includes:

A precision power supply capable of generating the substrate voltages
Microprobing equipment to make contact with the silicon substrate
Timing and synchronization electronics
Target-specific fixtures or modifications

This attack vector highlights the importance of considering semiconductor physics when evaluating hardware security. Even with perfect cryptographic algorithms and careful software implementation, the fundamental physical properties of the implementation materials can introduce vulnerabilities.

## Software-Induced Hardware Faults

Not all fault injection requires specialized equipment. Some of the most interesting techniques exploit the boundary between software and hardware, using carefully crafted software operations to induce hardware-level faults.

The notorious Rowhammer attack demonstrates this approach. By repeatedly accessing specific DRAM memory rows (hammering them), adjacent rows can experience bit flips due to electrical interference. These bit flips occur at the hardware level but are triggered by software activity. Attackers have used Rowhammer to escape virtual machines, gain kernel privileges, and bypass memory protection mechanisms.

Similarly, certain CPU cache manipulation techniques can induce errors in processor operation. Cache timing attacks like Flush+Reload and Prime+Probe have been extended to not just leak information but actively induce faulty behavior in some architectures.

The power and danger of software-induced hardware faults lies in their accessibility. Unlike laser systems or electromagnetic injectors, these attacks require no special equipment—just code running on the target system. This makes them scalable and deployable in real-world attack scenarios.

Researchers continue to discover new software-induced fault vectors. Recent examples include exploiting power management features to induce timing failures, manipulating CPU frequency scaling to create race conditions, and leveraging thermal management systems to create localized hotspots that affect computation.

## Building a Basic Fault Injection Platform

For those interested in exploring fault injection techniques, building a simple voltage glitcher represents an accessible starting point. Here's how you might approach it:

The heart of a voltage glitcher is a fast switching circuit that can momentarily disrupt the target's power supply. A simple design uses a high-speed MOSFET controlled by a microcontroller with precise timing capabilities. The Arduino platform can serve as an adequate controller for initial experiments, though more advanced timing might require an FPGA.

Begin by selecting your target—microcontrollers like the Arduino Uno or ESP8266 make good practice devices since they're inexpensive and well-documented. Identify the operations you want to attack, such as bootloader checks or PIN verification routines.

Your glitching circuit connects between the target's power supply and its VCC pin. When triggered, the circuit briefly pulls the supply voltage down, creating a glitch. The exact timing and duration are critical parameters you'll need to experiment with.

Initial testing involves scanning different timing parameters to identify promising glitch windows. This can be automated by having your controller vary the glitch timing across a range of values while monitoring the target for anomalous behavior.

Once you've identified effective glitch parameters, refine your approach to create reliable exploitation. Document each step carefully, as fault injection often requires precise reproduction of conditions for consistent results.

As your skills advance, you might explore more sophisticated platforms like ChipWhisperer, which combines fault injection with side-channel analysis capabilities, or build custom setups tailored to specific research goals.

## Countermeasures Against Fault Attacks

Defending against fault injection requires a multi-layered approach that combines detection, prevention, and tolerance strategies. Modern secure systems implement various countermeasures:

Redundancy serves as a fundamental defense—performing critical operations multiple times and comparing results can detect inconsistencies caused by fault injection. Triple modular redundancy (TMR) implements the same logic three times with majority voting to determine the correct output.

Sensors monitoring voltage, clock signals, temperature, and light can detect abnormal conditions that might indicate an attack in progress. Upon detection, the system can enter a secure state, erase sensitive data, or take other protective actions.

Timing and operation randomization make attacks more difficult by varying the execution pattern between runs. This prevents attackers from precisely targeting critical operations since they can't predict exactly when they'll occur.

Error detection codes protect data integrity. Techniques like parity bits, CRC, or more advanced error correction codes can identify when data has been corrupted by a fault attack.

Physical protection through specialized packaging or active mesh shields can prevent certain types of fault injection by detecting tampering attempts or blocking external signals.

Protocol-level countermeasures include challenge-response mechanisms that resist replay attacks even if individual operations are compromised. Carefully designed protocols can remain secure even if some constituent operations fail.

These defenses come with tradeoffs in performance, cost, and complexity. Depending on the security requirements and threat model, designers must carefully balance protection against practical constraints.

## Conclusion

Fault injection represents one of the most powerful tools in a hardware hacker's arsenal. By manipulating a device's operating conditions, researchers can reveal vulnerabilities that remain invisible to other analysis techniques.

As we've explored, these methods range from relatively simple voltage glitching to sophisticated laser fault injection systems. Each approach offers different tradeoffs in terms of cost, complexity, and effectiveness. The choice of technique depends on the target device, security mechanisms, and available resources.

For those beginning their hardware security journey, fault injection offers an exciting area of exploration that combines electronics, timing analysis, and security research. Even simple experiments can yield fascinating insights into how hardware systems fail and how those failures can affect security.

In our next section, we'll explore [Hardware Implants](./04-hardware-implants.md), devices designed to compromise security by being physically added to existing systems.

---

## Navigation

**Section: Attack Vectors**

* Previous: [Fault Injection Part 1](03-fault-injection.md)
* Next: [Hardware Implants](04-hardware-implants.md)
* [Back to Main Index](../../README.md)
