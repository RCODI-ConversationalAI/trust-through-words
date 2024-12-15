# Trust through Words: The Systemize-Empathize-Effect of Language in Task-oriented Conversational Agents

This repository contains the implementation and research materials for our paper investigating how language-based anthropomorphic design choices in conversational agents impact user trust and cognitive effort.

Paper link: https://doi.org/10.1016/j.chb.2024.108516

## Abstract

Anthropomorphic design has received increasing interest in research on conversational agents (CAs) and artificial intelligence (AI). Research suggests that the design of the agents’ language impacts trust and cognitive load by making the agent more “human-like”. This research seeks to understand the impacts and limits of two dimensions of language-focused anthropomorphism - the agent’s ability to _empathize_ and signal the effort to engage with the users’ feelings through language structure, and the agent’s effort to _systemize_ and take agency to drive the conversation using logic. We advance existing Theories of Mind (ToMs) with Linguistic Empathy to explain how language structure and logic used during the conversation impact two dimensions of system trust and cognitive load through _systemizing_ and _empathizing_. We conducted a behavioral online experiment involving 277 residents who interacted with one of three online systems, varying in their interface’s Systemizing-Empathizing capability: A menu-based interface (MUI) (no Systemizing Ability), a non-empathetic chatbot, and an empathetic chatbot (both with Systemizing Ability and Empathizing Ability). Half of the participants were emotionally disturbed to examine the moderating effects of anger. Our results revealed that systemizing, exhibited by both chatbots, lowers cognitive effort. The ability to empathize through language increased perceived helpfulness. While the empathetic chatbot was generally perceived as more trustworthy, this effect was reversed when users experienced anger: There is an _uncanny valley effect_, where empathizing through words has its limits. These findings advance research on anthropomorphism design and trust in CAs.

## Key Findings

- Users experience lower cognitive effort with systemizing-capable chatbots compared to menu-based interfaces
- Empathetic language increases perceived system helpfulness regardless of user's emotional state
- An "uncanny valley" effect emerges when users are angry: empathetic design can backfire on trustworthiness

## Overview

This research investigates how conversational agents' language capabilities affect user trust and cognitive load. Our study introduces a novel framework for understanding the impact of two key linguistic abilities in AI systems:

1. **Systemizing Ability:** The capacity to follow logical rules and drive conversations using systematic reasoning
2. **Empathizing Ability:** The capability to engage with users' emotions through carefully structured language

## Research Framework and Implementation

Our experimental setup comprises multiple components illustrated through four key diagrams that demonstrate the depth and scope of the research. Our theoretical framework (Figure 1) shows how language-based systemizing and empathizing capabilities influence both system trust (measured through perceived helpfulness and trustworthiness) and cognitive effort, while accounting for the moderating effect of user emotional states, particularly anger. The communication system comparison (Figure 2) provides a clear contrast between two chatbot variants: a full-capability system equipped with both Systemizing and Empathizing Abilities, and a basic system limited to Systemizing Ability only, highlighting the differences in language processing and response generation between these approaches.

The experimental design (Figure 3) outlines our comprehensive methodology, detailing the flow of participants through six experimental groups (A through F), including pre and post-surveys, the implementation of anger inducement treatment, and data collection via Firebase to assess various user experience metrics. Finally, our decision logic implementation (Figure 4) provides a detailed workflow for the tenant law advisory system, encompassing critical decision points such as move-out verification, property type classification, timeline compliance with the 45-day rule, damage claim assessment, receipt verification, and final deposit calculation. This comprehensive framework ensures a robust experimental design that can effectively measure the impact of different AI communication strategies on user interaction and trust.

![Figure1_TheoreticalModel](https://github.com/user-attachments/assets/ac08b524-462e-41ba-8f14-58f4f03a6e9b)
**Figure 1:** Our proposed theoretical framework illustrates the causal effect of (i) systemizing and (ii) empathizing capacities of languages on two dimensions of system trust as well as cognitive effort.

![Figure2_MockupComparisons](https://github.com/user-attachments/assets/fa932f65-a2cc-4f48-acb2-570c66399bc8)
**Figure 2:** This figure details the comparisons between communication systems with Systemizing Ability and Empathizing Ability (on the left) and without Empathizing Ability (on the right).

![Figure3_Experimental Workflow](https://github.com/user-attachments/assets/211984d8-9d18-4536-b4d9-09190c9cf1ab)
**Figure 3:** This diagram illustrates our experimental workflow for studying different communication system designs. Participants first log in with a SonalID and complete a pre-survey. They're then assigned to different groups that interact with various interfaces: a communication system with Systemizing Ability and Empathizing Ability (_i.e., an empathetic chatbot_) (Groups A and B), a communication system with only Systemizing Ability (_i.e., a non-empathetic chatbot_) (Groups C and D), or an MUI interface (Groups E and F). Some groups (B, D, and F) received an _"anger inducement"_ treatment. The system records interaction transcripts, timestamps, and participant responses through Firebase storage. The experiment concludes with post-surveys to gather participant feedback regarding trustworthiness, helpfulness, and cognitive effort, along with a comprehension test and a thank you message.

![Figure4_SecurityDepositFinal](https://github.com/user-attachments/assets/b1b40e5c-c35b-4464-b29f-580f177ff660)
**Figure 4:** This workflow illustrates a simplified decision tree logic that was used for our conversational agent (both Empathisizing Ability with Systemizing Ability and only Systemizing Ability). It begins by verifying if the tenant has moved out and then collects key information like move-out date and property type. For buildings with 7+ units, there's a 45-day timeline check. The system evaluates eligibility through multiple conditions: written lease verification, forwarding address provision, and damage claims assessment. If damages are claimed, receipts must be provided to calculate legitimate deductions; otherwise, the full deposit should be returned. Throughout the process, the system offers relevant landlord/tenant law information before concluding the interaction.

## Study Structure

The research employs a between-subjects factorial design with 277 participants, examining how different combinations of systemizing and empathizing capabilities affect user interactions. Our implementation includes carefully controlled language patterns, standardized response templates, and comprehensive data collection mechanisms to ensure robust experimental results.

This repository contains the complete implementation of these systems, along with analysis tools and experimental data, enabling replication and extension of our findings

## Repository Structure

- `data-analysis` - Statistical analysis scripts, visualization code, and analysis results
- `website-experiment` - Implementation of chatbot variants (empathetic and non-empathetic)

## Technical Implementation

- Three distinct communication systems:
  - Menu-based user interface (baseline)
  - Non-empathetic chatbot with systemizing ability
  - Empathetic chatbot with both systemizing and empathizing abilities
- Decision-tree logic for systemizing capability
- Controlled language patterns for empathetic responses

## Requirements

Detailed instructions for:
- Setting up the experimental environment
- Running the different chatbot variants
- Analyzing results
- Replicating the study

## Citation

If you use this code or data in your research, please cite:
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
      </h1>
      
    @article{BRUNSWICKER2024108516,
    title = {Trust through words: The systemize-empathize-effect of language in task-oriented conversational agents},
    journal = {Computers in Human Behavior},
    pages = {108516},
    year = {2024},
    issn = {0747-5632},
    doi = {https://doi.org/10.1016/j.chb.2024.108516},
    url = {https://www.sciencedirect.com/science/article/pii/S0747563224003844},
    author = {Brunswicker, Sabine and Zhang, Yifan and Rashidian, Christopher and Linna, Daniel W.},
    keywords = {Anthropomorphism, Empathizing-systemizing theory, Theory of mind (ToM), System trust, Cognitive effort, Behavioral online experiment},
    abstract = {Anthropomorphic design has received increasing interest in research on conversational agents (CAs) and artificial intelligence (AI). Research suggests that the design of the agents' language impacts trust and cognitive load by making the agent more "human-like". This research seeks to understand the impacts and limits of two dimensions of language-focused anthropomorphism - the agent's ability to empathize and signal the effort to engage with the users' feelings through language structure, and the agent's effort to systemize and take agency to drive the conversation using logic. We advance existing Theories of Mind (ToMs) with Emphasizing Ability to explain how language structure and logic used during the conversation impact two dimensions of system trust and cognitive load through systemizing and empathizing. We conducted a behavioral online experiment involving 277 residents who interacted with one of three online systems, varying in their interface's Systemizing-Empathizing capability: A menu-based interface (MUI) (no Systemizing Ability), a non-empathetic chatbot, and an empathetic chatbot (both with Systemizing Ability and Empathizing Ability). Half of the participants were emotionally disturbed to examine the moderating effects of anger. Our results revealed that systemizing, exhibited by both chatbots, lowers cognitive effort. The ability to empathize through language increased perceived helpfulness. While the empathetic chatbot was generally perceived as more trustworthy, this effect was reversed when users experienced anger: There is an uncanny valley effect, where empathizing through words has its limits. These findings advance research on anthropomorphism design and trust in CAs.}

## Contact

For questions about the implementation or research, please open an issue or contact sbrunswi@purdue.edu. 

## Acknowledgments

We gratefully acknowledge the Law Center for Better Housing for their collaboration in developing the legal advisory chatbot system. Special thanks to the 277 Chicago residents who participated in our study and provided valuable insights.
