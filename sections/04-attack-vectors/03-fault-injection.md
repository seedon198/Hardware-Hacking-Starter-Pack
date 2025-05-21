# Fault Injection Techniques

In the world of hardware security, fault injection stands as one of the most powerful and versatile techniques available to researchers and attackers alike. Unlike passive side-channel analysis, fault injection actively manipulates a target system's operating conditions to induce errors that can lead to security failures.

## Understanding Fault Injection

Fault injection works by disrupting a device's normal operation at precisely timed moments. When executed correctly, these disruptions can cause instruction skips, data corruption, or control flow changes that bypass security checks or reveal sensitive information.

The fundamental principle behind fault injection is simple: digital systems are designed to operate within specific parameters. When pushed outside these parameters—even momentarily—they may behave unpredictably. Security researchers exploit this unpredictability to find vulnerabilities that wouldn't be apparent under normal operating conditions.

What makes fault injection particularly powerful is its ability to bypass theoretical security. Even mathematically perfect cryptographic algorithms can fail when their implementations are disrupted at critical moments.

## Voltage Glitching

Voltage glitching is perhaps the most accessible fault injection technique, requiring relatively simple equipment while offering powerful results. The technique involves briefly changing the supply voltage to a target device—either dropping it (undervoltage) or raising it (overvoltage).

When a digital device experiences a sudden voltage change, its silicon transistors may not operate correctly. This can cause setup and hold time violations in digital logic, resulting in incorrect computation results or skipped instructions. The beauty of voltage glitching lies in its simplicity and effectiveness.

A basic voltage glitching setup might look like this:

```
Target Device
     |
     V
Voltage Control Circuit <-- Timing Controller (FPGA/Microcontroller)
     |
     V
Power Supply
```

The timing controller triggers the voltage change at precisely calibrated moments relative to the target's operation. For example, an attacker might target the moment a device verifies a PIN code or signature.

Here's a real-world example: researchers demonstrated that certain microcontrollers could be made to skip security verification instructions through precisely timed voltage drops. This allowed unauthorized firmware to be loaded, completely bypassing signature verification.

To build a simple voltage glitcher, you might use:

- A MOSFET to briefly short the power supply
- A microcontroller (like Arduino) to control timing
- An oscilloscope to verify and tune the glitch shape
- A target device with a security mechanism to bypass

Timing is absolutely critical. A glitch applied too early or too late will have no effect, while one with perfect timing might achieve the desired security bypass with a single attempt.

## Clock Manipulation

Clock manipulation takes advantage of the fact that digital systems rely on clock signals to synchronize their operations. By tampering with this clock—introducing glitches, changing frequency, or stopping it entirely—an attacker can induce calculable errors.

Unlike voltage glitching which affects the entire chip, clock glitching can be more precisely targeted at specific operations. This makes it particularly effective against systems with multiple clock domains or complex timing requirements.

There are several approaches to clock manipulation:

Clock glitching involves inserting additional pulses or removing expected ones. This can cause the target to sample data at incorrect times or execute multiple instructions when only one was intended.

Overclocking pushes the system beyond its rated frequency. At these speeds, certain operations may fail while others succeed, creating exploitable inconsistencies in behavior.

Clock stopping temporarily halts the clock at strategic moments, effectively "freezing" the system state. When the clock resumes, the system may continue operation with corrupted state data.

A researcher testing a secure bootloader might use clock glitching to target the moment when signature verification occurs. By causing the verification routine to skip crucial comparison operations, unsigned code might be accepted as legitimate.

Many modern systems implement countermeasures against clock manipulation, such as internal clock generators, clock monitoring circuits, and redundant verification. However, these protections often have their own vulnerabilities that skilled attackers can exploit.

## Electromagnetic Fault Injection (EMFI)

Electromagnetic fault injection represents a more sophisticated approach that doesn't require direct electrical connections to the target. Instead, it uses localized electromagnetic pulses to induce currents within the target device's circuitry.

The technique works by positioning an EM injection probe—essentially a specially designed coil or antenna—near the target chip. When a high-current pulse flows through this probe, it generates a strong, localized magnetic field that induces eddy currents in the target. These currents can disrupt normal operation much like voltage or clock glitching.

What makes EMFI particularly powerful is its ability to target specific regions of a chip without physical contact. By carefully positioning the probe and tuning the pulse characteristics, an attacker can focus on specific functional blocks within a complex chip.

Modern EMFI setups typically include:

- High-voltage pulse generators (up to several thousand volts)
- Specialized injection probes with various geometries
- Precise XYZ positioning systems for probe placement
- Triggering and synchronization electronics
- Analysis software for mapping vulnerable areas

Researchers have successfully used EMFI to extract encryption keys from secure elements, bypass secure boot implementations, and recover protected firmware from various devices.

The spatial precision of EMFI creates both challenges and opportunities. Finding the exact location to target requires patience and experimentation, but once found, exploits can be remarkably reliable and difficult to mitigate without comprehensive redesign.

Next, we'll continue exploring laser fault injection and other advanced techniques in the [second part of this section](./03-fault-injection-2.md).
