# Hardware Attack Vectors

Hardware attacks represent a powerful approach to security assessment that can bypass software protections by targeting the physical implementation of systems. This section explores the various hardware attack vectors available to security researchers and hackers.

## Overview of Hardware Attack Vectors

Hardware attack vectors can be classified based on the level of access required and the invasiveness of the approach:

1. **Non-invasive Attacks**
   - Require no physical alteration of the target
   - Include side-channel analysis and externally triggered fault injection
   - Often leave no evidence of tampering

2. **Semi-invasive Attacks**
   - Require some physical access but not direct contact with die
   - Might include decapsulation without damaging functionality
   - Examples include optical fault injection and EM analysis

3. **Fully Invasive Attacks**
   - Require direct access to internal components
   - Often destructive or permanently alter the target
   - Include microprobing and circuit modification

This section is divided into multiple parts:
- [Part 1: Physical Access Attacks](./01-physical-access.md)
- [Part 2: Side-Channel Attacks](./02-side-channel.md)
- [Part 3: Fault Injection Techniques](./03-fault-injection.md)
- [Part 4: Hardware Implants](./04-hardware-implants.md)
- [Part 5: Supply Chain Attacks](./07e-supply-chain.md)
