# Secure Boot and Trust Anchors

Secure boot represents the cornerstone of embedded device security. When implemented properly, it ensures that only authorized code executes on a device, providing a foundation for all other security measures. This section explores how secure boot works, implementation approaches, and techniques for both implementing and analyzing secure boot systems.

## The Need for Secure Boot

Every computing device follows a specific startup sequence after power-on. In traditional systems, this process implicitly trusts whatever code resides in the boot media. This trust model sufficed when physical access could be controlled and malicious firmware modifications seemed unlikely.

Today's connected world presents different challenges. Devices operate in hostile environments, firmware can be modified remotely, and even brief physical access might allow boot media tampering. Without verification, a device might execute malicious code that appears legitimate but contains backdoors or other vulnerabilities.

Secure boot addresses this fundamental security gap by verifying the integrity and authenticity of firmware before execution, establishing a chain of trust from hardware through the entire software stack.

## Chain of Trust Fundamentals

Secure boot implements a chain of trust—a sequence of verifications where each software component validates the next before transferring control:

```
Basic Chain of Trust:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Root of     │     │ Bootloader  │     │ Operating   │
│ Trust       │────>│             │────>│ System      │
│ (Hardware)  │     │ (verified)  │     │ (verified)  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Application │
                                        │             │
                                        │ (verified)  │
                                        └─────────────┘
```

The process begins with an immutable "root of trust"—typically hardware-based and resistant to tampering. This root verifies the first software component (often a bootloader), which then verifies the next stage, continuing until the entire software stack has been authenticated.

If verification fails at any stage, the boot process halts or reverts to a recovery mode, preventing execution of potentially compromised code.

## Hardware Roots of Trust

The foundation of secure boot lies in a hardware root of trust—a component inherently trusted due to its design and implementation. Several approaches exist:

### Read-Only Memory (ROM)

The simplest root of trust consists of immutable code stored in mask ROM—memory programmed during manufacturing that cannot be modified:

```
ROM-based Root of Trust:
┌──────────────────────────────────────────┐
│ System on Chip                           │
│                                          │
│  ┌────────────┐      ┌───────────────┐   │
│  │            │      │               │   │
│  │  Boot ROM  │─────>│  Main Memory  │   │
│  │            │      │               │   │
│  └────────────┘      └───────────────┘   │
│        │                                  │
│        │             ┌───────────────┐   │
│        └────────────>│ Cryptographic │   │
│                      │ Engine        │   │
│                      └───────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

This boot ROM contains minimal code that loads and verifies the next stage bootloader from flash memory or another storage medium. Its immutability ensures it cannot be compromised through software attacks, though sophisticated physical attacks might still be possible.

Many modern microcontrollers and SoCs include boot ROM with verification capabilities, providing a foundation for secure boot implementations.

### Secure Elements and TPMs

More sophisticated roots of trust include dedicated security processors:

**Secure Elements** are tamper-resistant chips designed to store sensitive data (like cryptographic keys) and perform security functions. They typically include cryptographic acceleration, physical security features, and isolated execution environments.

**Trusted Platform Modules (TPMs)** provide standardized security functions including secure key storage, random number generation, and platform attestation capabilities. Originally developed for PCs, TPM concepts now appear in many embedded security solutions.

Both options provide stronger security than simple ROM approaches but add cost and complexity to the system design.

### Secure Enclaves

Modern processors often include secure execution environments isolated from the main processing environment:

```
Secure Enclave Architecture:
┌───────────────────────────────────────────────────┐
│ System on Chip                                    │
│                                                   │
│  ┌────────────────┐        ┌──────────────────┐   │
│  │                │        │                  │   │
│  │  Normal World  │◄──────►│  Secure World    │   │
│  │  Execution     │        │  Execution       │   │
│  │                │        │                  │   │
│  └────────────────┘        └──────────────────┘   │
│                                     │             │
│                           ┌───────────────────┐   │
│                           │ Secure Boot and   │   │
│                           │ Key Storage       │   │
│                           └───────────────────┘   │
│                                                   │
└───────────────────────────────────────────────────┘
```

Examples include:
- ARM TrustZone
- Intel Software Guard Extensions (SGX)
- AMD Secure Encrypted Virtualization (SEV)

These technologies create isolated regions within the processor that handle sensitive operations—including secure boot verification—protected from the main operating system.

## Verification Mechanisms

Within the secure boot process, several mechanisms verify code integrity and authenticity:

### Cryptographic Hashing

Hash functions create a fixed-length "fingerprint" of firmware that changes if any part of the code is modified. Basic secure boot implementations might simply compare calculated hashes against expected values stored in the root of trust:

```
Hash Verification Process:
┌───────────────┐     ┌──────────────────┐
│ Firmware      │────>│ Hash Function    │─────┐
│ Image         │     │ (SHA-256, etc.)  │     │
└───────────────┘     └──────────────────┘     │
                                               │
                                               ▼
┌───────────────┐     ┌──────────────────┐    │
│ Stored        │────>│ Compare          │<───┘
│ Hash Value    │     │                  │
└───────────────┘     └──────────────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │ Continue boot or │
                      │ halt if mismatch │
                      └──────────────────┘
```

While simple, this approach provides no protection if an attacker can modify both the firmware and the stored hash values.

### Digital Signatures

More robust implementations use asymmetric cryptography (public-key cryptography) to verify firmware authenticity:

1. The firmware developer signs the firmware image or its hash using a private key kept securely offline
2. The device contains the corresponding public key in its root of trust
3. During boot, the device verifies the signature using the public key
4. If verification succeeds, the firmware is known to come from the authorized signer

This approach prevents attackers from creating valid firmware even if they can modify the device's storage, as they lack the private signing key.

### Certificate Chains

For complex systems or those requiring revocation capabilities, certificate chains extend the digital signature approach:

```
Certificate Chain Verification:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Root        │     │ Intermediate│     │ Firmware    │
│ Certificate │────>│ Certificate │────>│ Certificate │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                  │                    │
       │                  │                    │
       ▼                  ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Verify      │     │ Verify      │     │ Verify      │
│ Signature   │     │ Signature   │     │ Firmware    │
└─────────────┘     └─────────────┘     └─────────────┘
```

This approach enables flexible trust models where different entities might sign different components, and compromised certificates can be revoked without replacing the root certificate.

## Common Secure Boot Implementations

Several secure boot implementations appear frequently in embedded systems:

### ARM TrustZone with Secure Boot

ARM's security architecture combines hardware isolation with boot verification:

1. The processor starts in secure mode, executing code from a secure boot ROM
2. This code verifies and loads a secure bootloader
3. The secure bootloader verifies the normal world bootloader
4. Execution transitions to normal mode once verification completes

TrustZone provides both the secure boot foundation and ongoing protection through hardware-enforced separation between secure and normal execution environments.

### UEFI Secure Boot

While originally developed for PCs, Unified Extensible Firmware Interface (UEFI) Secure Boot now appears in higher-end embedded systems:

1. The platform includes a set of trusted certificates
2. Each bootloader component carries a digital signature
3. The firmware verifies each signature before execution
4. Unauthorized bootloaders are prevented from loading

UEFI Secure Boot provides standardized mechanisms for managing certificates, revocation, and custom security policies.

### Custom Bootloader Verification

Many embedded systems, especially microcontroller-based devices, implement custom secure boot solutions:

1. A mask ROM bootloader contains verification code and public keys
2. This verifies a primary bootloader in flash memory
3. The primary bootloader verifies application firmware
4. The chain continues through all bootable components

These custom implementations vary widely in security, depending on the verification algorithms, key management, and protection against hardware attacks.

## Implementing Secure Boot

For hardware hackers developing secure systems, implementing secure boot requires careful consideration of several factors:

### Key Management

The security of any secure boot implementation ultimately depends on key management:

```
Key Management Considerations:
┌────────────────────────────────────────────────────┐
│                                                    │
│  Key Generation                                    │
│  - Use hardware random number generators           │
│  - Generate keys in secure environments            │
│  - Use appropriate key lengths (RSA 2048+, EC 256+)│
│                                                    │
│  Key Storage                                       │
│  - Store private keys offline in secure facilities │
│  - Protect public keys in device trust anchors     │
│  - Consider key separation for different functions │
│                                                    │
│  Key Distribution                                  │
│  - Secure manufacturing programming processes      │
│  - Unique keys per device or per batch             │
│  - Protection during device provisioning           │
│                                                    │
│  Key Rotation                                      │
│  - Plan for certificate expiration                 │
│  - Implement secure update mechanisms              │
│  - Consider recovery from compromise               │
│                                                    │
└────────────────────────────────────────────────────┘
```

Poor key management undermines otherwise strong implementations. For example, if private signing keys are exposed through insecure development practices, attackers can sign malicious firmware that passes verification.

### Anti-Rollback Protection

Secure boot must protect against downgrade attacks where attackers install older, vulnerable firmware versions that still contain valid signatures:

1. **Version counters** store the minimum acceptable firmware version
2. **One-way counters** in secure storage prevent decreasing the value
3. **Version verification** occurs during the signature checking process

These mechanisms ensure that once a security vulnerability is patched, devices cannot be downgraded to vulnerable versions.

### Recovery Mechanisms

Even the most carefully designed secure boot systems must account for recovery scenarios:

**Authentication failures** might occur due to data corruption rather than attacks. Recovery mechanisms must balance security against the risk of "bricking" devices during legitimate updates.

**Key compromise** requires a secure method to update verification keys without creating security holes. This often involves multiple layers of keys with different update mechanisms.

**Manufacturing requirements** often necessitate special modes for initial programming. These must be irreversibly disabled before devices reach end users.

Well-designed recovery approaches maintain security while providing pathways to recover from both malicious attacks and accidental failures.

## Analyzing Secure Boot Implementations

For hardware hackers evaluating existing systems, several approaches help assess secure boot security:

### Documentation Analysis

Begin with available documentation:

1. **Technical specifications** often describe security features, though perhaps not their implementations
2. **Developer documentation** might reveal bootloader commands or security architecture
3. **Open source components** may provide insights into proprietary implementations
4. **Certification documentation** for standards compliance can reveal security design

While documentation rarely reveals vulnerabilities directly, it provides context for further analysis and identifies security claims to verify.

### Boot Process Observation

Monitoring the boot process reveals much about secure boot implementation:

```
Boot Analysis Points:
┌─────────────────┐     ┌─────────────┐     ┌─────────────┐
│ Initial Boot    │────>│ Bootloader  │────>│ OS Kernel   │
│ ROM/Flash       │     │ Execution   │     │ Boot        │
└─────────────────┘     └─────────────┘     └─────────────┘
       │                      │                    │
       ▼                      ▼                    ▼
┌─────────────────┐     ┌─────────────┐     ┌─────────────┐
│ Observe:        │     │ Observe:    │     │ Observe:    │
│ - Initial reads │     │ - Signature │     │ - Final     │
│ - Crypto ops    │     │   checks    │     │   security  │
│ - Error handling│     │ - Debugging │     │   state     │
└─────────────────┘     └─────────────┘     └─────────────┘
```

Techniques for observation include:
- UART/serial console monitoring
- Logic analyzer capture of flash memory transactions
- Power analysis during cryptographic operations
- Timing analysis of boot stages

These observations reveal whether verification actually occurs, which algorithms are used, and how the system responds to verification failures.

### Firmware Analysis

Extracting and analyzing firmware provides direct insight into secure boot implementations:

1. **Extract firmware** using techniques covered in the [Firmware Extraction section](./06-firmware-analysis.md)
2. **Identify verification code** through static analysis
3. **Locate cryptographic routines** for signature verification
4. **Find key storage** locations and access controls
5. **Analyze error handling** for verification failures

This analysis reveals implementation details invisibile through external observation, including potential flaws in verification logic.

### Common Vulnerability Patterns

Several vulnerability patterns appear regularly in secure boot implementations:

**Verification Bypass** vulnerabilities allow skipping integrity checks entirely, often through unexpected boot modes or debugging features left enabled in production.

**Weak Cryptography** undermines otherwise sound designs, whether through short keys, vulnerable algorithms, or flawed implementations.

**Hardware Attacks** may extract keys or manipulate verification through voltage glitching, clock manipulation, or physical probing.

**Implementation Flaws** in verification logic might allow modified code to pass checks through crafted signatures or hash collisions.

Recognizing these patterns helps focus security analysis on likely vulnerability points.

## Advanced Topics in Secure Boot

Several advanced topics extend basic secure boot capabilities:

### Remote Attestation

Remote attestation extends secure boot to provide cryptographic proof of device state to remote systems:

1. The secure boot process measures device state (loaded software, configuration)
2. These measurements are cryptographically signed by the device's trust anchor
3. Remote systems verify these signatures to confirm the device's authentic state
4. This enables trust decisions based on the device's software configuration

This capability allows cloud services or management systems to verify endpoint security before granting access to sensitive resources.

### Measured Boot

While secure boot prevents unauthorized code execution, measured boot records what actually executed:

1. Each component is measured (hashed) before execution
2. These measurements are securely stored in tamper-resistant storage
3. The sequence of measurements creates a verifiable boot log
4. This log enables after-the-fact verification of the boot process

Unlike secure boot, measured boot doesn't prevent unauthorized execution but provides evidence for later security analysis.

### Dynamic Root of Trust

Traditional secure boot verifies all code from initial power-on. Dynamic root of trust establishes a trusted environment later in the boot process:

1. The system boots with minimal verification
2. At a specific point, a special CPU instruction creates a verified environment
3. This instruction resets the processor to a known state, then loads and verifies code
4. The verified code establishes a secure environment despite an untrusted initial boot

This approach, used in technologies like Intel TXT and AMD SKINIT, offers flexibility for systems where controlling the entire boot chain proves impractical.

## Conclusion

Secure boot provides the foundation for trusted computing in embedded systems. By ensuring that only authorized code executes, it establishes a root of trust that supports all other security measures. Hardware hackers should understand both implementation approaches for building secure systems and analysis techniques for evaluating existing ones.

Remember that secure boot represents just one element of a comprehensive security strategy. While essential, it must work alongside memory protection, secure communication, and physical security measures to create truly secure embedded systems.

In the next section, [Memory Protection and Execution Security](./09b-memory-protection.md), we'll explore how to protect code and data once a system has securely booted.
