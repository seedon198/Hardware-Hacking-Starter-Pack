# Circuit Extraction and Schematic Capture

After identifying components and tracing connections on a PCB, the next critical step is documenting these findings in a usable format. Circuit extraction and schematic capture transform your physical observations into logical representations that reveal how a device functions. This process bridges the gap between hardware examination and functional understanding.

## Why Create Schematics?

Creating schematics from physical circuits might seem redundant—after all, you can see the actual device. However, schematics offer several crucial advantages:

Schematics organize information logically rather than physically. While PCBs arrange components to minimize space and optimize manufacturing, schematics arrange them to show functional relationships. This logical organization makes understanding circuit operation much easier.

They also serve as essential documentation. Memory fades, and returning to a project months later without proper documentation means starting almost from scratch. A well-drawn schematic captures your understanding in a format that remains useful long after you've forgotten the details.

Perhaps most importantly, schematics reveal patterns invisible in physical examination. Common circuit configurations like voltage dividers, filters, and amplifiers become immediately recognizable when properly documented, allowing you to understand the designer's intent rather than just the physical implementation.

## Preparing for Schematic Capture

Before diving into schematic creation, organize your observations and establish a clear scope:

First, determine your documentation goals. Are you capturing the entire device, or focusing on specific subsystems? Complete schematics require substantial effort, so targeting relevant sections often makes more sense than documenting everything.

Next, gather your PCB analysis notes, component identifications, and connection traces. Organize these by functional blocks—power management, microcontroller interfaces, sensors, etc. This organization will structure your schematic development.

Finally, collect reference materials that might inform your work. Similar device schematics, component datasheets, and application notes often reveal standard circuit configurations that help interpret what you're seeing.

## Schematic Capture Approaches

Several approaches exist for creating schematics from physical hardware, each with distinct advantages:

### The Incremental Approach

The incremental approach builds the schematic gradually by adding components and connections as you trace them:

```
Incremental Schematic Capture Process:
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│                  │    │                  │    │                  │
│  Start with      │───>│  Add components  │───>│  Connect traced  │
│  major component │    │  as discovered   │    │  signals         │
│                  │    │                  │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                                          │
         ┌───────────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│                  │    │                  │    │                  │
│  Verify against  │<───│  Add labels and  │<───│  Organize and    │
│  physical board  │    │  annotations     │    │  group by function│
│                  │    │                  │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

This approach works well when reverse engineering unfamiliar circuits. Begin with a central component (usually a microcontroller or main IC), then add connected components one by one as you trace connections on the physical board. The schematic grows organically as your understanding develops.

The incremental approach allows you to focus on areas of interest and stop when you've documented enough for your purposes. However, it can result in disorganized schematics if you don't periodically reorganize your layout.

### The Block-based Approach

The block-based approach divides the circuit into functional sections and documents each separately:

```
Block-based Schematic Capture:
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────┐ │
│  │ Power       │      │ Processing  │      │ I/O     │ │
│  │ Management  │─────>│ Section     │─────>│ Section │ │
│  │             │      │             │      │         │ │
│  └─────────────┘      └─────────────┘      └─────────┘ │
│         │                    │                   │     │
│         └────────────────────┼───────────────────┘     │
│                              │                         │
│                              ▼                         │
│                     ┌────────────────┐                 │
│                     │  Inter-block   │                 │
│                     │  Connections   │                 │
│                     └────────────────┘                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

This method excels for complex devices where documenting everything at once becomes overwhelming. Start by identifying major functional blocks (power, processing, interfaces, etc.), then capture each block's internal circuitry separately. Finally, document connections between blocks.

The block approach creates well-organized schematics but requires some upfront understanding of the device's architecture. It's particularly effective when collaborating with others, as team members can work on different blocks simultaneously.

### The Reference-based Approach

When reverse engineering a device with similarities to known designs, a reference-based approach saves considerable time:

1. Find similar reference designs or schematics from datasheets, development boards, or open-source projects
2. Use these as starting templates, adapting them to match your specific device
3. Verify each section against your physical hardware, noting modifications

This approach leverages existing knowledge but requires careful verification—assumptions based on reference designs can lead to errors if the actual implementation differs.

## Creating Clear, Useful Schematics

Regardless of your approach, several principles ensure your schematics remain useful:

### Logical Organization

Organize components by function rather than physical location. Standard practices include:

- Power flows generally from left to right or top to bottom
- Inputs appear on the left, outputs on the right
- Ground connections point downward
- Similar functions group together
- Signal flow follows a logical path

This organization makes the circuit's function more apparent than the physical layout, which often optimizes for manufacturing concerns rather than clarity.

### Appropriate Detailing

Include enough detail to understand functionality without overwhelming the reader:

```
Component Representation Examples:
┌───────────────────────────────────────────────────────┐
│                                                       │
│  Resistor:         ─┳━━━┳─      Power supply: ┌───┐   │
│                      R1            or regulator│VCC│   │
│                     1kΩ                       └─┬─┘   │
│                                                 │     │
│  Capacitor:        ─┳┫┳─       Complex IC:  ┌─────┐   │
│                      C1                      │     │   │
│                     100nF                    │ U1  │   │
│                                              │     │   │
│  Microcontroller:  ┌────────┐               └─────┘   │
│                    │        │      (Show only relevant │
│                    │        │       pins with labels)  │
│                    │  MCU   │                          │
│                    │        │                          │
│                    └────────┘                          │
│                                                       │
└───────────────────────────────────────────────────────┘
```

For complex ICs, include only the pins relevant to your analysis—showing all pins on a 100+ pin microcontroller overwhelms the schematic without adding value. However, always include component identifiers, values, and critical specifications.

### Clear Signal Labeling

Label signals consistently and descriptively throughout the schematic:

- Use meaningful names (RESET_N rather than Pin43)
- Maintain consistent naming conventions (all active-low signals with _N suffix, for example)
- For multi-page schematics, use off-page connectors with clear labeling
- Consider using color coding for different signal types (power, ground, data, clock, etc.)

Well-labeled signals make the schematic easier to follow and help readers understand signal flow across complex circuits.

### Notes and Annotations

Include context that might not be obvious from the circuit alone:

- Operating conditions or configuration details
- Observed behaviors during testing
- Alternative component options
- Uncertain connections or speculative functions
- References to related documentation

These annotations transform a simple circuit diagram into a valuable reference that captures your complete understanding.

## Schematic Capture Tools

Several tools facilitate schematic creation from reverse engineering work:

**KiCad** offers a powerful open-source schematic editor with an extensive component library. Its separation of schematic capture from PCB layout makes it well-suited for reverse engineering documentation.

**Eagle** provides a popular schematic editor with an intuitive interface. While not free for all uses, its widespread adoption means you'll find many reference designs in Eagle format.

**Fritzing** offers a simpler approach suitable for basic circuits. Its less formal style can be appropriate for quick documentation of straightforward devices.

**Draw.io** and similar general-purpose diagramming tools work for simple schematics when dedicated EDA software seems excessive. These tools offer more flexibility in presentation but lack electronic design-specific features.

**Paper and pencil** remain valuable tools, especially for initial capture during the reverse engineering process. A hand-drawn schematic can later transfer to digital tools once you've refined your understanding.

## Special Considerations for Reverse Engineering

Several challenges arise specifically when creating schematics from existing hardware:

### Handling Unknown Components

When encountering unidentified components, document what you can observe:

```
Unknown Component Documentation:
┌────────────────────────────────────────────┐
│ Component: U23 (Unknown 8-pin IC)          │
│ Package: SOIC-8                            │
│ Markings: A4TG (possibly manufacturer code)│
│                                            │
│ Connections:                               │
│ - Pin 1: Connected to VCC (3.3V)           │
│ - Pin 2: Connected to microcontroller PA2  │
│ - Pin 3: Connected to microcontroller PA3  │
│ - Pin 4: Connected to GND                  │
│ - Pin 5-7: No connections                  │
│ - Pin 8: Connected to antenna matching     │
│                                            │
│ Notes:                                     │
│ - Located in RF section                    │
│ - Possibly a wireless transceiver          │
│ - Active during Bluetooth operations       │
└────────────────────────────────────────────┘
```

This approach documents your observations while acknowledging uncertainty, allowing you or others to refine the identification later.

### Multi-layer Board Challenges

Tracing connections on multi-layer boards presents significant challenges. When connections disappear into internal layers, several approaches help:

- Use conventional pin numbering and datasheet information to infer likely connections
- Include notes about uncertain connections with your best assessment
- Consider using dotted lines or different colors to indicate inferred versus confirmed connections
- Create separate "observed" and "functional" schematics if significant uncertainty exists

### Incremental Refinement

Schematic creation during reverse engineering typically involves progressive refinement:

1. Create an initial functional schematic showing major components and connections
2. Test hypotheses about functionality through observation and measurement
3. Refine the schematic as understanding improves
4. Add details about signal characteristics, timing, and behaviors
5. Document variations observed across different device samples or revisions

This iterative process results in increasingly accurate documentation as your understanding evolves.

## Example Workflow: From PCB to Schematic


1. **Initial survey**: Identify major components (USB connector, main IC, voltage regulator, crystal, LEDs) and document their markings and locations.

2. **Component research**: Look up the main IC (let's say it's a CH340G), find its datasheet, and understand its pinout and typical application circuit.

3. **Connection tracing**: Using a multimeter or visual inspection, trace connections between the CH340G and other components, especially the USB connector and serial output pins.

4. **Schematic creation**: Start with the CH340G at the center, add connected components with their values, and include signal labels based on pin functions from the datasheet.

5. **Verification**: Compare your schematic against reference designs in the CH340G datasheet, noting any differences in your implementation.

6. **Functional annotation**: Add notes about observed behaviors, like LED activity during data transmission or specific signal characteristics observed on an oscilloscope.

The resulting schematic captures not just the physical connections but your understanding of how the circuit functions—far more valuable than a mere physical representation.

## Conclusion

Circuit extraction and schematic capture transform physical observations into useful documentation that reveals a device's function. While the process requires patience and attention to detail, the resulting schematics provide invaluable insights for further analysis, modification, or security assessment.

Remember that schematics from reverse engineering always represent your current understanding, which continues to evolve with further investigation. The best documentation acknowledges uncertainty where it exists while clearly communicating confirmed observations.

In the next section, [Advanced Techniques: Decapsulation and Microprobing](./08e-advanced-techniques.md), we'll explore more specialized techniques for accessing and analyzing the internal structures of electronic components themselves.

---

## Navigation

**Section: Reverse Engineering**

* Previous: [Component Id](03-component-id.md)
* Next: [Advanced Techniques](05-advanced-techniques.md)
* [Back to Main Index](../../README.md)
