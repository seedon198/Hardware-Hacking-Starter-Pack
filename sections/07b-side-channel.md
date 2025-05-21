# Side-Channel Attacks

Side-channel attacks exploit information gained from the physical implementation of a system rather than weaknesses in algorithms or protocols. These attacks analyze physical characteristics like timing, power consumption, electromagnetic emissions, or sound to extract sensitive information.

## Principles of Side-Channel Analysis

### Side-Channel Information Leakage

1. **Sources of Leakage**
   - Power consumption variations
   - Electromagnetic radiation
   - Acoustic emissions
   - Timing differences
   - Thermal patterns

2. **Why Side-Channels Matter**
   - Bypass theoretical security of algorithms
   - Exploit physical implementation weaknesses
   - Often non-invasive and difficult to detect
   - Can work against otherwise secure systems

3. **Attack Scenarios**
   - Cryptographic key extraction
   - Password/PIN recovery
   - Secret algorithm identification
   - Behavioral analysis

## Power Analysis Attacks

### Simple Power Analysis (SPA)

1. **Basic Principles**
   - Direct observation of power consumption patterns
   - Identifying different operations from power traces
   - Visual inspection of power signatures

2. **Equipment Requirements**
   - Oscilloscope (digital, preferably high sampling rate)
   - Current measurement probe or shunt resistor
   - Trigger mechanism (I/O line, clock, etc.)
   - Data capture and analysis software

3. **Practical Example: PIN Analysis**
   ```
   # Hardware setup:
   # - Insert 10Ω resistor in series with device's power line
   # - Connect oscilloscope probe across resistor
   # - Trigger on PIN entry button press
   # - Record power traces during PIN entry
   # - Compare power signatures for different digits
   ```

4. **Attack Applications**
   - Distinguishing operations in cryptographic algorithms
   - Identifying secret-dependent conditional branches
   - Analyzing input validation routines
   - Revealing operation sequencing

### Differential Power Analysis (DPA)

1. **Advanced Statistical Techniques**
   - Collecting many power traces for statistical analysis
   - Correlation with hypothetical power models
   - Noise reduction through statistical methods
   - Extracting keys bit by bit

2. **Attack Methodology**
   - Collect power traces for known inputs
   - Create power consumption hypotheses
   - Apply statistical methods to correlate hypotheses with measurements
   - Extract secret key information

3. **Example DPA Against AES**
   ```
   # Simplified DPA process for AES:
   # 1. Collect thousands of power traces during encryption
   # 2. Focus on first S-box output in round 1
   # 3. For each possible key byte (0-255):
   #    - Calculate hypothetical S-box output
   #    - Correlate with power at that moment
   # 4. Highest correlation reveals correct key byte
   # 5. Repeat for all 16 bytes of the key
   ```

4. **Tools for Power Analysis**
   - ChipWhisperer (open-source hardware/software)
   - Riscure Inspector
   - Custom setups with oscilloscopes and analysis software

### Correlation Power Analysis (CPA)

1. **Refinement of DPA**
   - Using Pearson correlation coefficient
   - More efficient than traditional DPA
   - Requires fewer traces to succeed
   - Based on power consumption models

2. **Implementation Steps**
   - Model expected power consumption for operations
   - Measure actual power traces
   - Calculate correlation between model and measurements
   - Identify highest correlation as correct key guess

3. **Hamming Weight and Hamming Distance Models**
   - Hamming Weight: Number of 1s in data
   - Hamming Distance: Number of different bits between states
   - Power consumption often proportional to these values
   - Base of many practical CPA attacks

## Electromagnetic Analysis (EMA)

### Principles of EM Emanations

1. **Sources of EM Leakage**
   - Digital switching noise
   - Clock harmonics
   - Data-dependent processing
   - Power regulation circuits

2. **Advantages Over Power Analysis**
   - Non-contact measurement
   - Spatial selectivity (targeting specific chip areas)
   - Can bypass some power analysis countermeasures
   - Higher signal-to-noise ratio for certain components

3. **Equipment Requirements**
   - EM probes (near-field probes)
   - Low-noise amplifiers
   - Spectrum analyzer or oscilloscope
   - Positioning system (optional but helpful)

### Simple Electromagnetic Analysis (SEMA)

1. **Basic Technique**
   - Direct observation of EM traces
   - Visual identification of operations
   - Similar to SPA but using EM emissions
   - Spatial probe positioning for best signal

2. **Target Identification**
   - Using spectrum analyzer to find frequencies of interest
   - Mapping EM hotspots on the device
   - Correlating emissions with operations

3. **Practical Example: SEMA on Smart Card**
   ```
   # Equipment:
   # - H-field probe (small loop antenna)
   # - Low-noise amplifier (20-40dB gain)
   # - Digital oscilloscope (1GS/s or better)
   
   # Process:
   # 1. Position probe over processor area
   # 2. Trigger capture during cryptographic operation
   # 3. Analyze trace for operational patterns
   # 4. Identify key-dependent operations
   ```

### Differential Electromagnetic Analysis (DEMA)

1. **Statistical Approach**
   - Similar methodology to DPA
   - Collection of many EM traces
   - Statistical analysis to extract secrets
   - Can target specific components on complex devices

2. **Implementation Considerations**
   - Precise probe positioning
   - Stable trigger mechanism
   - Environmental EM noise reduction
   - High sampling rate for capture

3. **Advanced Techniques**
   - Multi-probe capture for spatial diversity
   - Time-frequency analysis
   - Machine learning for pattern identification
   - Template attacks using characterization data

## Acoustic and Timing Attacks

### Acoustic Cryptanalysis

1. **Sound as an Information Channel**
   - Different operations produce different sounds
   - CPU/GPU coil whine
   - Keyboard acoustic differences
   - Printer and mechanical device sounds

2. **Attack Scenarios**
   - Keyboard acoustic eavesdropping
   - CPU acoustic cryptanalysis
   - Printer acoustic reconstruction
   - Hard drive access pattern detection

3. **Example: Keyboard Acoustic Attack**
   ```
   # Equipment:
   # - Sensitive microphone
   # - Audio recording device with high sample rate
   # - Machine learning software for classification
   
   # Process:
   # 1. Record training data of known keystrokes
   # 2. Extract acoustic features
   # 3. Train classifier on labeled data
   # 4. Record target typing and classify keystrokes
   ```

### Timing Attacks

1. **Principles of Timing Analysis**
   - Different operations take different time to execute
   - Conditional branches create measurable timing differences
   - Cache access patterns affect execution time
   - Network response timing can reveal server-side processing

2. **Local Timing Attacks**
   - Measuring execution time of cryptographic operations
   - Cache timing attacks against AES and other algorithms
   - Branch prediction analysis
   - Memory access timing differences

3. **Remote Timing Attacks**
   - Network-based timing measurements
   - Statistical analysis to reduce noise
   - TCP timestamps for precision
   - Amplification techniques

4. **Example: Cache Timing Attack**
   ```
   # Simplified cache timing attack:
   # 1. Flush the entire cache
   # 2. Let victim execute operation with secret data
   # 3. Time access to specific memory addresses
   # 4. Fast access indicates cache hit (address was used)
   # 5. Infer secret data based on which addresses are in cache
   ```

## Thermal and Optical Side Channels

### Thermal Imaging Attacks

1. **Heat as Information Source**
   - Components generate heat during operation
   - Different operations create different thermal patterns
   - Recently entered PINs/passwords leave thermal residue
   - Thermal cameras can detect these patterns

2. **Equipment Requirements**
   - Thermal imaging camera (FLIR or similar)
   - Image processing software
   - Timing mechanism for synchronized capture

3. **Attack Examples**
   - PIN entry thermal residue
   - Password thermal tracking
   - Cryptographic operation identification
   - Secure element localization

### Optical Emanation Analysis

1. **Visual Data Leakage**
   - LED activity indicators
   - Screen reflections
   - Power indicator fluctuations
   - Component light emission

2. **Advanced Optical Techniques**
   - Photonic emission analysis from silicon
   - Using specialized cameras to detect chip activity
   - Reconstructing operations from photonic emissions
   - Infrared analysis of chip hot spots

3. **Case Study: LED Data Exfiltration**
   ```
   # Attack scenario:
   # - Target: Air-gapped system with visible status LEDs
   # - Setup: High-speed camera focused on LED
   # - Malware modulates data into LED blink patterns
   # - Camera records LED activity
   # - Software decodes blink patterns back to data
   ```

## Practical Side-Channel Analysis

### Setting Up a Basic Lab

1. **Essential Equipment**
   - Digital oscilloscope (minimum 100MHz bandwidth)
   - Set of EM probes (H-field and E-field)
   - Precision power supply
   - Target development boards (Arduino, STM32, etc.)
   - ChipWhisperer or similar side-channel analysis platform

2. **Software Tools**
   - Signal processing software
   - Statistical analysis packages
   - Visualization tools
   - Attack frameworks (SCALib, ChipWhisperer Analyzer)

3. **First Experiment: Power Analysis**
   ```
   # Beginner setup:
   # - Arduino running AES encryption
   # - 10Ω resistor in series with power line
   # - Oscilloscope measuring voltage across resistor
   # - Trigger wire connected to digital pin
   # - Capture power traces during encryption
   # - Analyze correlation between power and processed data
   ```

### Signal Acquisition Techniques

1. **Improving Signal Quality**
   - Proper grounding and shielding
   - Signal amplification for weak signals
   - Bandwidth limiting to reduce noise
   - Averaging multiple measurements
   - Synchronous sampling with stable triggers

2. **Dealing with Countermeasures**
   - Identifying and bypassing jitter
   - Managing random delays
   - Handling operation shuffling
   - Coping with noise injection

3. **Advanced Triggering Methods**
   - Pattern-based triggering
   - Multi-stage triggers
   - External event synchronization
   - Software-defined trigger points

## Countermeasures and Mitigation

### Hardware Countermeasures

1. **Shielding and Isolation**
   - Electromagnetic shielding (Faraday cages)
   - Power filtering and regulation
   - Physical separation of sensitive components
   - Encapsulation and potting

2. **Balanced Design**
   - Differential logic (dual-rail)
   - Constant-time operations
   - Balanced power consumption
   - Symmetric routing and layout

3. **Noise Generation**
   - Adding random operations
   - Injecting noise into power consumption
   - Frequency jittering
   - Multiple clock domains

### Software Countermeasures

1. **Algorithm Implementation**
   - Constant-time coding practices
   - Avoiding secret-dependent branches
   - Regular memory access patterns
   - Blinding techniques for cryptographic operations

2. **Randomization and Masking**
   - Data masking with random values
   - Order shuffling of operations
   - Random delays insertion
   - Address randomization

3. **Example: AES Masking Implementation**
   ```c
   // Unprotected AES S-box lookup
   output = s_box[input ^ key_byte];
   
   // Masked implementation
   mask = random_byte();
   masked_input = input ^ mask;
   masked_output = masked_s_box[masked_input ^ key_byte];
   output = masked_output ^ transformed_mask;
   ```

## Conclusion

Side-channel attacks represent a powerful class of hardware security threats that exploit the physical characteristics of implementations rather than theoretical weaknesses. As cryptographic algorithms have become mathematically stronger, side-channel vulnerabilities have emerged as the practical weak link in many systems.

Understanding these attacks requires knowledge across disciplines including electronics, signal processing, statistics, and cryptography. For hardware hackers, side-channel analysis provides a valuable toolset for evaluating security beyond what is visible in code or specifications.

In the next section, we'll explore [Fault Injection Techniques](./07c-fault-injection.md), which actively manipulate hardware to induce errors that can be exploited for security breaches.
