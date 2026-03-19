<!-- difficulty: advanced -->
<!-- tags: fault-injection, methodology, countermeasures -->

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

## Clock Glitching in Practice

Clock glitching manipulates the timing signal that synchronizes processor operations. Processors sample their inputs at precise moments dictated by the clock edge. When you insert a spurious extra clock pulse or stretch/compress a cycle, the processor attempts to execute logic that has not had sufficient time to settle, producing incorrect results at architecturally visible boundaries.

### Practical Clock Glitching Circuit

A crowbar-style clock glitcher uses a fast MOSFET to momentarily short the clock line to ground, creating a narrow runt pulse that the target processor misinterprets as a valid cycle.

```ascii
Clock Glitcher – Crowbar Circuit:

         3.3 V
           │
           ├──────────────────────────┐
           │                          │
    Xtal   ▼  R1 10Ω                  │
    Osc ──[R1]──────────┬─────────> Target CLK
                        │
                        │  Q1 (BSS138 or similar NMOS)
                        ├──────────┐
                        │  Drain   │
                       [Q1]        │
                        │  Source  │
                       GND         │
                        │          │
           Trigger ─────┤Gate      │
           (from MCU     │          │
            or FPGA)     └──────────┘

Trigger pulse width: 2 ns – 50 ns (tune empirically)
Trigger delay from reference: adjustable in 1 ns steps
```

The glitch control MCU monitors a trigger signal—such as a UART activity line or a GPIO that the target toggles when entering sensitive code—and fires the gate of Q1 after a programmable delay. The resulting runt pulse corrupts exactly one clock cycle in the instruction pipeline.

### EM Fault Injection Setup

Electromagnetic fault injection (EMFI) requires a small coil placed directly above the target IC package. A fast high-current pulse through the coil induces a magnetic field that perturbs supply or signal lines inside the package without requiring direct contact.

Coil construction: wind 3–5 turns of 0.2 mm enamelled copper wire on a 3–5 mm diameter former. Keep inductance below 200 nH to achieve sub-nanosecond rise times. Drive the coil from a dedicated pulser circuit (e.g., a half-bridge with GaN FETs) capable of delivering 20–50 A peak into the coil impedance.

Placement and timing are the two critical variables. Mount the coil on an XY stage with 100 µm resolution and sweep it systematically across the package surface while looping the target through a sensitive operation. Log every trial's offset coordinates alongside the observed outcome (normal, crash, or exploitable fault). Good injection spots tend to cluster over the clock distribution network or power delivery mesh of the target die.

### VCC Glitching Methodology

VCC glitching briefly collapses the power supply to a level too low for reliable logic operation. Most processors have a valid operating range of, say, 2.7–3.6 V; pulling VCC to 1.8 V for 10–100 ns causes one or more pipeline stages to miscompute while preserving enough energy for the device to continue running.

A typical glitch campaign follows this workflow:

1. Establish a timing reference. Use a GPIO toggle, UART character, or SPI transaction that occurs a known number of cycles before the target instruction.
2. Coarse sweep. Vary offset (0–10 ms in 10 µs steps) and width (10–500 ns in 10 ns steps). Record three outcome classes: no effect, crash, and anomalous response.
3. Fine sweep. Narrow the window around promising offsets to 1 ns resolution using an FPGA-based glitch engine such as ChipWhisperer.
4. Exploit development. Confirm that the anomalous response corresponds to the security bypass (wrong PIN accepted, secure boot skipped, readout protection disabled).

### Example Attack Walkthrough: Bypassing a Security Check

Consider a microcontroller that stores a four-byte PIN in protected flash and compares it byte-by-byte against user input before allowing firmware readout. The comparison loop looks roughly like:

```c
for (int i = 0; i < 4; i++) {
    if (input[i] != stored_pin[i]) {
        lock_device();   // branch-taken on mismatch
        return;
    }
}
enable_debug_readout();
```

The goal is to corrupt the conditional branch instruction so the processor falls through to `enable_debug_readout()` despite the PIN mismatch.

Step 1 – Identify the timing reference. The target sends a UART ACK after receiving the four PIN bytes and before executing the comparison. Oscilloscope captures show this ACK arrives approximately 45 µs before the first comparison.

Step 2 – Set offset to 44–48 µs and width to 20–60 ns. Run 10 000 trials per parameter combination.

Step 3 – At offset 45.3 µs and width 35 ns, the device responds with the debug readout response rather than the lock response on roughly 1 in 200 attempts.

Step 4 – Run in a loop with an incorrect PIN. After an average of 200 attempts, readout protection is bypassed and flash contents are retrieved.

This class of attack has been demonstrated on real devices including PIC, STM32, and Nordic Semiconductor targets by researchers at Riscure, LimitedResults, and independent security groups.

## Detection Methods and Countermeasures

Defending against clock and voltage glitching requires detecting the abnormal conditions and responding before sensitive state is compromised.

**Voltage monitors (brown-out detectors):** Place a comparator on VCC with a threshold set 5–10% below nominal. On detection, assert a hardware reset or erase keys before the MCU can execute further instructions. Many modern microcontrollers include configurable brown-out reset circuits; ensure the threshold is set in fuse bytes and that it cannot be overridden via software.

**Clock integrity detectors:** A secondary oscillator or ring oscillator running in parallel can detect clock stretching or extra pulses. If the primary and secondary clocks drift by more than one cycle within a window, flag a tamper event.

**Redundant computation:** Execute the critical comparison twice and compare results. A glitch that corrupts one execution is unlikely to produce the same incorrect result twice, so a mismatch triggers a lock.

**Temporal jitter:** Insert a random delay (sourced from a hardware TRNG) between the timing reference and the sensitive operation. This forces an attacker to sweep a much wider parameter space, increasing the trial count by orders of magnitude.

**Active mesh and shields:** BGA packaging with ground planes above the die makes EM injection significantly harder by attenuating the induced field before it reaches sensitive structures.

**Security policy on reset:** On any unexpected reset or tamper flag, increment a counter stored in non-volatile memory. Exceed a threshold and lock the device permanently or require factory intervention to unlock.

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
