# PCB Analysis and Circuit Tracing

The printed circuit board (PCB) forms the foundation of modern electronic devices. By analyzing PCB layout and tracing connections between components, hardware hackers can understand how a device functions even without official documentation. This section explores techniques for PCB analysis, from visual inspection to advanced circuit tracing.

## Understanding PCB Construction

Modern PCBs are sophisticated multi-layer constructions. Before diving into analysis techniques, it helps to understand how these boards are designed and manufactured.

A typical PCB consists of layers of conductive material (usually copper) separated by insulating substrate. The simplest boards have just one or two layers, while complex designs might use 8, 16, or even more layers. This layered structure allows designers to create complex interconnections in a compact space.

```
Simplified PCB Cross-Section:
                 ┌───────────────────────────────────┐
                 │ Component (e.g., resistor, IC)    │
  ┌──────────────┴───────────────────────────────────┴──────────────┐
  │  Solder                                            Solder        │
┌─┴──────────────────────────────────────────────────────────────────┴─┐
│                          Top Copper Layer                             │
├─────────────────────────────────────────────────────────────────────┬─┤
│                          Insulating Substrate                       │ │
├─────────────────────────────────────────────────────────────────────┘ │
│                          Inner Copper Layer 1                         │
├─────────────────────────────────────────────────────────────────────┬─┤
│                          Insulating Substrate                       │ │
├─────────────────────────────────────────────────────────────────────┘ │
│                          Inner Copper Layer 2                         │
├─────────────────────────────────────────────────────────────────────┬─┤
│                          Insulating Substrate                       │ │
├─────────────────────────────────────────────────────────────────────┘ │
│                          Bottom Copper Layer                          │
└──────────────────────────────────────────────────────────────────────┘
```

The components we see on a board connect to these copper layers through various methods:

**Through-hole components** have pins that pass completely through the board, connecting to pads on multiple layers. These connections are visible from both sides of the board, making them relatively easy to trace.

**Surface-mount components** attach only to the outer layers with tiny solder connections. These compact components dominate modern electronics, allowing for smaller, denser designs.

**Vias** are small holes that connect traces between different layers. These critical elements allow signals to navigate the complex three-dimensional structure of multi-layer boards.

## Visual PCB Analysis

Effective PCB analysis begins with careful visual inspection. With practice, you'll recognize common patterns and circuit blocks just by their appearance.

### Initial Orientation

When examining an unfamiliar board, first establish a basic orientation:

1. Identify power input regions. Look for large capacitors, inductors, and voltage regulator ICs that typically handle power conversion.

2. Locate the main processing elements. Modern devices usually have a central microcontroller or processor surrounded by supporting components.

3. Find input/output sections. Areas connecting to external interfaces (USB ports, buttons, displays) have distinct layouts often isolated from processing areas.

4. Recognize RF sections. Wireless communication circuits have characteristic layouts with matching networks, antennas, and careful isolation from other circuitry.

This initial map helps focus your analysis on relevant areas based on what you're trying to understand about the device.

### Board Markings

PCB silkscreen layers contain valuable information. Manufacturers print reference designators, component values, test points, and other markings to assist with assembly and testing. These markings provide important clues for reverse engineers:

```
Common PCB Markings:
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  R12   100Ω     Resistor #12, 100 ohms                   │
│                                                           │
│  C34   10μF     Capacitor #34, 10 microfarads            │
│                                                           │
│  U7              Integrated Circuit #7                    │
│                                                           │
│  TP3             Test Point #3                            │
│                                                           │
│  J1    USB       Connector #1, USB interface             │
│                                                           │
│  GND             Ground connection point                  │
│                                                           │
│  VCC   3V3       Power rail, 3.3 volts                   │
│                                                           │
│  D5    LED       Diode #5, Light Emitting Diode          │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

Pay special attention to unpopulated footprints and test points. These often indicate debug interfaces or manufacturing test connections that might provide access to internal functionality. Even without components installed, these footprints reveal the board's capabilities and potential access points.

### Identifying Board Layers

Understanding a PCB's layer structure helps you trace connections that aren't immediately visible:

1. Hold the board up to a bright light. On simpler boards, you might see traces on inner layers.

2. Look for vias (small plated holes), which indicate connections between layers.

3. Examine the board edge. Exposed layer edges sometimes show the copper layers stacked within the substrate.

4. Check for layer count markings. Some boards include text like "4L" (four-layer) in their silkscreen or copper.

For complex boards where visual inspection isn't sufficient, more advanced techniques like X-ray imaging might be necessary to reveal internal connections.

## Circuit Tracing Techniques

Tracing circuits—following the connections between components—reveals how a device functions. Several approaches help with this fundamental reverse engineering skill.

### Visual Tracing

For visible connections, visual tracing is the simplest approach:

1. Start at a component of interest.
2. Follow visible copper traces connecting to that component.
3. Document each connected component and continue tracing.
4. Use magnification when needed for fine traces.

This process works well for simple boards but becomes challenging with multi-layer designs where connections disappear into vias or inner layers.

### Continuity Testing

When traces aren't visually traceable, a multimeter's continuity function becomes indispensable:

```
Basic Continuity Testing:
┌───────────────────────────────────┐
│                                   │
│   ┌───────────┐     ┌─────────┐   │
│   │           │     │         │   │
│   │           │     │         │   │
│   │ Multimeter│     │  PCB    │   │
│   │           │     │         │   │
│   └─────┬─────┘     └────┬────┘   │
│         │                │        │
│         │    Probes      │        │
│         └────────────────┘        │
│                                   │
└───────────────────────────────────┘
```

1. Set your multimeter to continuity mode (usually indicated by a sound icon).
2. Touch one probe to your starting point (e.g., a component pin).
3. Test potential connection points with the other probe.
4. A beep or low resistance reading indicates a connection.
5. Document each discovered connection and continue tracing.

This method works even with invisible traces but requires careful probing to avoid accidental shorts or false readings.

### Logical Deduction

Experienced reverse engineers use logical deduction to predict connections. Common integrated circuits follow standard pinout patterns, and certain components almost always connect in predictable ways:

- Bypass capacitors connect between power and ground near ICs
- Pull-up/pull-down resistors connect to specific signal lines and power/ground
- Crystal oscillators connect to specific microcontroller pins
- Communication buses follow standard topologies

By recognizing these patterns, you can make educated guesses about connections that might be difficult to trace physically.

### Advanced Circuit Tracing

For more complex boards, several advanced techniques help trace connections:

**Low-power microscopy** provides detailed views of fine traces and small components. Digital microscopes with 20-200x magnification work well for most PCB analysis.

**Selective lighting** can make traces more visible. Try shining light at various angles or using colored lights to enhance contrast between board features.

**Circuit tracers** inject signals into the board that can be detected elsewhere, helping identify connected points without damaging the board.

**IR thermography** can reveal active traces during operation. Power-carrying traces heat slightly during use, which infrared cameras can detect.

## Digital Logic Analysis

Once you've identified physical connections, understanding the logical function of digital signals becomes important.

### Signal Classification

Digital signals generally fall into several categories:

- **Clocks**: Regular, consistent square waves
- **Data lines**: Irregular patterns carrying information
- **Control signals**: Specific patterns that trigger actions
- **Power signals**: Relatively stable DC voltages
- **Ground references**: Zero-voltage reference points

Identifying which category a signal belongs to helps understand its role in the circuit.

### Bus Identification

Many signals organize into buses—groups of lines that function together. Common bus types include:

```
Common Digital Buses:
┌───────────────────────────────────────────────────────┐
│                                                       │
│  SPI (Serial Peripheral Interface)                    │
│  • MOSI, MISO, SCK, CS lines                          │
│  • One master, multiple slaves                        │
│                                                       │
│  I²C (Inter-Integrated Circuit)                       │
│  • SDA, SCL lines                                     │
│  • Multiple masters and slaves on same two wires      │
│                                                       │
│  UART/Serial                                          │
│  • TX, RX lines                                       │
│  • Point-to-point connection                          │
│                                                       │
│  Memory buses                                         │
│  • Address, data, and control lines                   │
│  • Parallel connections to RAM/flash                  │
│                                                       │
└───────────────────────────────────────────────────────┘
```

Recognizing these bus patterns helps identify communication between components and potential monitoring points.

### Signal Monitoring

To understand how signals function during operation, monitoring tools become essential:

**Logic analyzers** capture and display multiple digital signals simultaneously, showing timing relationships and protocol details.

**Oscilloscopes** provide detailed views of individual signals, including analog characteristics that logic analyzers might miss.

**Protocol analyzers** decode common communication protocols automatically, translating raw signals into human-readable data.

When monitoring signals, look for patterns during device startup, during specific operations, and during error conditions. These transitions often reveal the most about how a system functions.

## Practical PCB Analysis Workflow

Let's examine a practical workflow for analyzing an unfamiliar PCB:

1. **Photograph the board** in detail from multiple angles with good lighting.

2. **Identify major components** and look up their datasheets.

3. **Highlight functional areas** (power, processing, I/O, etc.) on a board photo or diagram.

4. **Trace critical connections** starting from the main processor or controller.

5. **Identify test points and debug interfaces** that might provide access.

6. **Monitor signals during operation** to understand dynamic behavior.

7. **Create a simplified schematic** of the sections relevant to your analysis.

This methodical approach builds understanding incrementally, focusing effort on the most relevant areas first.

## Tools for PCB Analysis

Several tools significantly enhance PCB analysis capabilities:

**Optical tools**: Digital microscopes, magnifying glasses, and good lighting reveal details invisible to the naked eye.

**Electrical tools**: Multimeters, oscilloscopes, and logic analyzers provide insights into electrical behavior.

**Documentation tools**: Cameras, notebooks, schematic capture software, and PCB visualization programs help record and organize findings.

**Reference materials**: Component datasheets, protocol specifications, and similar product documentation provide context for your observations.

## Conclusion

PCB analysis forms the backbone of hardware reverse engineering. By methodically examining board layout and tracing circuits, you can understand how complex devices function without prior documentation. These skills improve with practice—each board you analyze builds experience that makes future work more efficient.

Remember that successful PCB analysis requires patience and careful documentation. Take your time, record your findings systematically, and recognize that complex boards might require multiple sessions to fully understand.

In the next section, [Component Identification](./08c-component-id.md), we'll explore techniques for identifying and understanding the various electronic components found on PCBs.
