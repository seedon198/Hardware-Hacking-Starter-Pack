# Component Identification

Understanding the individual components on a PCB is crucial for hardware reverse engineering. Each component provides clues about a device's functionality, capabilities, and potential vulnerabilities. This section explores how to identify and understand the various electronic components you'll encounter during hardware hacking.

## The Challenge of Component Identification

Modern electronic devices contain a bewildering array of components—from simple resistors to complex system-on-chips with billions of transistors. Many components have minimal markings, and manufacturers often use proprietary codes rather than standard identifiers. Despite these challenges, a methodical approach can successfully identify most components you'll encounter.

## Passive Components

Passive components don't amplify or process signals but instead modify electrical current in predictable ways. These fundamental building blocks appear on virtually every PCB.

### Resistors

Resistors limit current flow and divide voltage in circuits. Surface-mount resistors rarely display their values directly. Instead, they use standardized marking schemes or may have no markings at all.

```
Common Resistor Packages:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Through-hole:                                       │
│  ───[███████]───  Color bands indicate value         │
│                                                      │
│  SMD (0603, 0805, etc.):                            │
│  ┌─────┐                                             │
│  │  25 │  "25" = 2.5Ω or 25Ω or 250Ω                │
│  └─────┘  (depends on context and design)           │
│                                                      │
│  Current-sense:                                      │
│  ┌───────┐                                           │
│  │       │  Very low value, wide trace pattern      │
│  └───────┘                                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

For unmarked SMD resistors, you'll need to use a multimeter's resistance function. However, accurate measurement often requires removing at least one end of the component from the circuit to avoid parallel paths affecting your reading.

The physical size of SMD resistors provides clues about their power handling capability. Larger packages typically handle more power but don't necessarily indicate resistance value.

### Capacitors

Capacitors store electrical charge temporarily. They come in various types with different characteristics:

```
Common Capacitor Types:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Ceramic:                                            │
│  ┌───┐                                               │
│  │   │  Small, often unmarked, various colors        │
│  └───┘                                               │
│                                                      │
│  Electrolytic:                                       │
│  ┌─┐                                                 │
│  │█│  Cylindrical, polarized, marked with value      │
│  └─┘                                                 │
│                                                      │
│  Tantalum:                                           │
│  ┌───┐                                               │
│  │▲+ │  Usually marked with value and polarity       │
│  └───┘                                               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

Capacitor placement provides functional clues:
- Bulk capacitors near power inputs stabilize incoming voltage
- Bypass capacitors near IC power pins filter local noise
- Timing capacitors pair with resistors in oscillator circuits
- Coupling capacitors sit between stages of analog circuits

For unmarked capacitors, measurement in-circuit is challenging. Context, physical characteristics, and circuit position often provide the best indications of type and approximate value.

### Inductors

Inductors store energy in magnetic fields and resist changes in current flow. They appear in power supplies, filters, and RF circuits:

```
Common Inductor Types:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Ferrite bead:                                       │
│  ┌───┐                                               │
│  │███│  Small, black, blocks high-frequency noise    │
│  └───┘                                               │
│                                                      │
│  SMD inductor:                                       │
│  ┌───┐                                               │
│  │▒▒▒│  Typically square with spiral pattern         │
│  └───┘                                               │
│                                                      │
│  Shielded inductor:                                  │
│  ┌─────┐                                             │
│  │█████│  Enclosed in metal case for isolation       │
│  └─────┘                                             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

Inductors often lack value markings, making context critical for identification. Inductors in switch-mode power supplies tend to be larger than those used for signal filtering. RF inductors frequently have shielding to prevent interference.

## Active Components

Active components amplify signals or perform complex functions by controlling current flow. These components form the core of a device's capabilities.

### Diodes

Diodes allow current to flow in only one direction. They serve various functions depending on their type:

```
Common Diode Types:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Signal diode:                                       │
│  ───|>|───  Small, directionality marked by band     │
│                                                      │
│  Zener diode:                                        │
│  ───|<|───  Similar to signal diode but used for     │
│             voltage regulation                       │
│                                                      │
│  LED:                                                │
│  ┌───┐                                               │
│  │   │  Light-emitting, usually with colored lens    │
│  └───┘                                               │
│                                                      │
│  Schottky:                                           │
│  ───|>|───  Fast switching, lower forward voltage    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

SMD diodes typically have a marking to indicate cathode direction. This marking is crucial for understanding current flow direction in the circuit.

Testing diodes requires a multimeter's diode test function. A working diode shows low resistance in one direction and high resistance in the other. Specialized diodes like Zeners may require specific test procedures.

### Transistors

Transistors are semiconductor devices that switch or amplify electronic signals. Common types include:

```
Common Transistor Packages:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  SOT-23 (small BJT/MOSFET):                         │
│    ┌───┐                                             │
│    │1 3│  Three-terminal device, marked with code    │
│    └─┬─┘                                             │
│      2                                               │
│                                                      │
│  TO-220 (power transistor):                          │
│    ┌─────┐                                           │
│    │     │  Large tab for heat dissipation           │
│    │  o  │  Often used for power regulation          │
│    │  o  │                                           │
│    │  o  │                                           │
│    └─────┘                                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

Transistor identification often relies on package recognition and markings. Small SMD transistors typically use codes that require lookup in cross-reference databases. Power transistors are easier to identify due to their distinctive packages and thermal considerations.

The context provides important clues—transistors near power sections likely handle power regulation, while those in signal paths might amplify or switch signals. Multiple identical transistors often indicate buffer stages or H-bridge configurations for motor control.

### Integrated Circuits

Integrated circuits (ICs) present the greatest identification challenge. These complex components often contain entire systems and may be marked with obscure codes.

```
Common IC Package Types:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  SOIC (Small Outline IC):                            │
│  ┌───────┐                                           │
│  │o     o│  8-16 pins usually, with marking on top   │
│  │o     o│                                           │
│  │o     o│                                           │
│  │o     o│                                           │
│  └───────┘                                           │
│                                                      │
│  QFP (Quad Flat Package):                            │
│  ┌─────────┐                                         │
│  │ooooooooo│  Pins on all four sides                 │
│  │o       o│  Common for microcontrollers            │
│  │o       o│                                         │
│  │o       o│                                         │
│  │ooooooooo│                                         │
│  └─────────┘                                         │
│                                                      │
│  BGA (Ball Grid Array):                              │
│  ┌─────────┐                                         │
│  │         │  Connection balls underneath            │
│  │         │  Used for complex processors            │
│  │         │  Difficult to probe manually            │
│  └─────────┘                                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

IC identification involves several approaches:

1. **Markings research**: Look up the codes printed on the package. Resources like Octopart, electronic component distributor websites, and specialized forums often help decode manufacturer-specific markings.

2. **Contextual analysis**: A chip's location, surrounding components, and board section provide clues. An IC near an Ethernet jack is likely an Ethernet controller; one connected to multiple flash chips is probably a microcontroller.

3. **Pin count and configuration**: The number and arrangement of pins often indicate a chip's function. For example, 8-pin ICs in power sections are frequently voltage regulators.

4. **Package recognition**: Certain packages are commonly used for specific functions. QFN-16 packages often house communication interface ICs, while large BGAs typically contain processors or FPGAs.

For complex ICs where visual inspection proves insufficient, additional techniques like bus monitoring or datasheet cross-referencing might be necessary.

## Specialized Components

Beyond standard components, you'll encounter specialized elements that provide insight into a device's capabilities.

### Crystals and Oscillators

These components provide timing references for digital circuits:

```
Crystal and Oscillator Types:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Crystal:                                            │
│  ┌─────┐                                             │
│  │     │  Two-terminal, often marked with frequency  │
│  └─────┘  Requires external capacitors               │
│                                                      │
│  Crystal Oscillator:                                 │
│  ┌─────┐                                             │
│  │     │  Four-terminal, self-contained              │
│  └─────┘  Outputs square wave directly               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

The frequency marking on these components reveals important information about the system's operation. Common frequencies include:
- 32.768 kHz: Real-time clock applications
- 12-25 MHz: Microcontroller main clocks
- 25-50 MHz: Communication interface references
- 14.318 MHz: Video-related applications

### Connectors

Connectors provide insights into both internal and external interfaces:

```
Common Connector Types:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Header pins:                                        │
│  ┌───┐                                               │
│  │:::│  Often used for programming or debugging      │
│  └───┘                                               │
│                                                      │
│  JTAG connector:                                     │
│  ┌───────┐                                           │
│  │:::::::│  Usually 10-20 pins, debugging interface  │
│  └───────┘                                           │
│                                                      │
│  FPC/FFC connector:                                  │
│  ┌───────┐                                           │
│  │     ▄▄│  Flat cable connector for displays, etc.  │
│  └───────┘                                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

Standard pin arrangements often reveal connector purposes. For example, a 2x5 header with specific pin spacing might indicate a JTAG interface, while a 4-pin header could be SPI or I²C. Unpopulated connector footprints can be particularly revealing, as they might indicate debugging or programming interfaces intentionally left unexposed in production devices.

### RF Components

Wireless capabilities involve specialized components:

```
RF Component Examples:
┌──────────────────────────────────────────────────────┐
│                                                      │
│  RF Transceiver IC:                                  │
│  ┌─────────┐                                         │
│  │         │  Often shielded area with antenna path  │
│  │         │                                         │
│  └─────────┘                                         │
│                                                      │
│  Antenna:                                            │
│  ┌────────────┐                                      │
│  │\/\/\/\/\/\/│  PCB trace, chip, or external part   │
│  └────────────┘                                      │
│                                                      │
│  RF Shield:                                          │
│  ┌─────────────┐                                     │
│  │             │  Metal enclosure over RF section    │
│  │             │                                     │
│  └─────────────┘                                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

RF sections typically isolate from other circuitry, often encased in metal shields to prevent interference. The presence of matching networks (clusters of small inductors and capacitors) near antenna connections provides clues about operating frequencies. Different wireless standards (WiFi, Bluetooth, cellular, etc.) use characteristic component arrangements that become recognizable with experience.

## Component Identification Workflow

A systematic approach to component identification improves efficiency:

1. **Document the visible components**. Photograph the board and create a component inventory, noting locations and any visible markings.

2. **Identify the major ICs first**. These define the overall system architecture and help make sense of surrounding components.

3. **Map power distribution**. Follow the power from input to various voltage domains, identifying regulators and conversion circuits.

4. **Analyze by functional blocks**. Group components into logical sections (power, processing, memory, I/O, etc.) and analyze each section's components in context.

5. **Use component databases and search engines**. Look up unknown markings in component databases, distributor websites, and datasheet repositories.

6. **Consult community resources**. Forums, teardown websites, and specialized communities often have experience with specific components or devices.

7. **Test in-circuit when possible**. Use multimeters, oscilloscopes, or specialized equipment to measure component characteristics.

This methodical approach builds a comprehensive understanding of the device under study, even when faced with unmarked or obscure components.

## Component Identification Tools

Several tools facilitate component identification:

**Digital microscope**: Essential for reading tiny markings on modern components. Models with 20-200x magnification cover most identification needs.

**Component testers**: Dedicated devices that automatically identify and measure common components. Particularly useful for unmarked passive components when removed from the circuit.

**Reference databases**: Online resources like Octopart, FindChips, and manufacturer websites help decode part markings.

**Multimeter**: Measures resistance, capacitance, and tests semiconductor junctions to help identify unmarked components.

**Specialized forums**: Communities like EEVblog, Reddit's AskElectronics, or stack exchange sites provide expert assistance with difficult identifications.

## Conclusion

Component identification forms a crucial skill in hardware reverse engineering. While markings and visual characteristics provide initial clues, context and circuit positioning often prove equally important. With experience, you'll develop pattern recognition that accelerates the identification process—certain component combinations and layouts become instantly recognizable as standard circuit blocks.

Remember that component identification often involves some uncertainty, especially with unmarked or generic parts. When exact identification isn't possible, narrowing down to a family of components with similar characteristics is often sufficient for practical reverse engineering.

In the next section, [Circuit Extraction and Schematic Capture](./08d-circuit-extraction.md), we'll explore how to translate your component identification work into functional circuit documentation.
