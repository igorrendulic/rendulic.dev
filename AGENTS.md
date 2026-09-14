# Personal Developer Website Agent Instructions

This file provides guidance to Codex and other AI agents when working with code in this repository.

## Project Overview

This repository contains my personal developer website.

The primary goal is to help me find senior software engineering and AI engineering roles.

The website should quickly communicate:

* who I am
* what I specialize in
* what I have built
* the scale and impact of my work
* my engineering experience and technical depth
* selected projects and writing
* how to contact me

The primary audience is engineering managers, CTOs, technical founders, senior engineers, and technical recruiters.

The site should feel like the website of an experienced engineer, not a generic portfolio or SaaS landing page.

## Technology

Use:

* React
* TypeScript
* Tailwind CSS

Keep the frontend lightweight.

Prefer React, Tailwind, and browser-native functionality over unnecessary dependencies.

Content such as articles and detailed project descriptions should preferably live in Markdown or MDX rather than being hardcoded into React components.

## Design Direction

The primary visual direction is NeoBrutalism combined with a modern developer/engineering aesthetic.

Use the NeoBrutalism design system as the main reference:

* Documentation: https://neobrutalism.com/docs
* Components: https://neobrutalism.com/components
* Blocks: https://neobrutalism.com/blocks
* Templates: https://neobrutalism.com/templates
* Themes: https://neobrutalism.com/themes

Before creating common UI components from scratch, check whether an appropriate NeoBrutalism component or block already exists.

Prefer using or adapting those components where appropriate.

Follow the installation and integration practices documented by NeoBrutalism rather than duplicating their implementation inside this repository.

The developer’s work and technical credibility should remain the focus.

## Visual Character

The site should incorporate the general NeoBrutalist visual language:

* strong typography
* thick borders
* hard shadows
* square geometry
* high contrast
* deliberate use of strong colors
* tactile interactions
* clear visual hierarchy

It can also borrow selectively from:

* retro computing
* technical documentation
* engineering tools
* terminals
* old workstation interfaces

Do not turn the website into a fake terminal.

Avoid generic SaaS aesthetics, glassmorphism, excessive gradients, soft floating cards, excessive rounded corners, and decorative animation.

The design should be distinctive without becoming visually noisy.

## Site Structure

Likely sections include:

* Home
* Projects
* Blog
* About

Keep the architecture simple and content-driven.

Avoid unnecessary abstractions and excessive component hierarchies.

## Responsive Design

The site must work well on desktop, tablet, and mobile.

Do not simply shrink desktop layouts on mobile. Recompose complex layouts when necessary while preserving the NeoBrutalist visual language.

Do not rely on hover for essential information.

## Accessibility and Performance

Maintain:

* semantic HTML
* keyboard accessibility
* visible focus states
* sufficient contrast
* reduced-motion support
* good page-load performance

Do not sacrifice usability for the visual style.

Keep JavaScript and dependencies minimal.

## Agent Guidelines

When making changes:

* preserve the site’s purpose as a professional developer website
* use https://neobrutalism.com/docs as the primary design-system reference
* consult NeoBrutalism components and blocks before implementing equivalents
* prefer adapting existing NeoBrutalism components over recreating them
* use Tailwind CSS as the primary styling mechanism
* keep content separate from presentation where practical
* keep components simple and focused
* avoid unnecessary dependencies and abstractions
* preserve responsive behavior and accessibility

## Plan Implementation

After presenting an approved implementation plan and the user requests implementation, first ask whether they want to use the task-graph skill to create task files and a Kanban board.

If yes, use task-graph to create the task graph and execute the tasks from clean, task-focused context.

If no, implement the approved plan normally.