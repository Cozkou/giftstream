# GiftStream   Conveyor Belt Idle Game with Item Spawning and Movement

## Overview
A responsive webpage featuring a conveyor belt idle game with an item spawning system and smooth item movement animations. The application displays a horizontal conveyor belt centered on the screen with a Christmas-themed background and automatically generates items with different rarities at regular intervals that move smoothly across the belt. Items can be clicked to pause the game and display detailed information in a modal window with purchase functionality.

## Game Type
2D game

## Visual Design
- Christmas-themed background using festive red-green gradient tones or subtle Christmas imagery
- Horizontal conveyor belt displayed with cartoony styling: light border, soft shadow, rounded corners, and transparent color
- Clean, minimal, and responsive layout
- Conveyor belt centered on the screen
- "GiftStream" title positioned at the top of the page layout
- Help text positioned underneath the conveyor belt with the message: "Click on a mystery box to unbox it!"
- No header component in the layout
- Minimalistic footer with simple muted text, centered, no icons or decorations
- Enhanced modal window with festive Christmas-themed styling including decorative borders, glowing snowflake icons, and warm color palette
- Global "Arcade Classic" font style applied consistently across all components
- No transparent background overlay to make the background image more prominent

## Core Features
- Conveyor belt with smooth item movement animations
- Intelligent item spawning system that maintains consistent horizontal gaps between items to prevent overcrowding
- Items appear on the right side inside the conveyor belt container only when adequate space is available
- Items smoothly move from right to left across the conveyor belt with proper spacing maintained
- Items automatically disappear when they exit the left edge of the conveyor
- Four rarity tiers for items: common, rare, epic, and legendary
- Visual rarity indicators through distinct glow or border colors
- Reliable click functionality for items that pauses all conveyor movement
- Modal window that correctly triggers and appears when an item (mystery box) is clicked
- Item purchase system with frontend storage
- Visual purchase confirmation with festive animations
- Responsive design that works across different screen sizes
- Christmas-themed visual styling
- Cartoony conveyor belt appearance without background textures

## Item System
- Items spawn automatically with intelligent spacing control to maintain visual balance
- New items only spawn when there is adequate horizontal space on the conveyor belt
- Consistent horizontal gap maintained between all items to prevent overcrowding
- Each item is assigned one of four rarities: common, rare, epic, or legendary
- Items are represented as festive mystery boxes that look like wrapped gifts with bright ribbons, decorative patterns, and 3D effect using CSS
- Mystery box visual design includes wrapped gift appearance with ribbons, bows, and festive patterns
- 3D effect achieved through CSS styling with shadows, gradients, and perspective transforms
- Rarity-based visual styling with distinct colors:
  - Common: green glow/border
  - Rare: blue glow/border
  - Epic: purple glow/border
  - Legendary: gold glow/border
- Items appear positioned on the right side within the conveyor belt area
- Items move smoothly from right to left across the conveyor belt container
- Movement implemented with smooth animations using CSS transitions or JavaScript position updates
- Configurable movement speed through a `movementSpeed` variable for easy adjustment
- Items are automatically removed when they reach the left edge of the conveyor
- Items are clickable with reliable click detection that pauses all conveyor movement when clicked

## Interaction System
- Proper React state management for modal visibility using `isModalOpen` state variable
- Reliable click functionality on all mystery box items moving across the conveyor belt with correct event handling
- Click event listeners properly attached to each mystery box element immediately after spawning
- Event listeners must be correctly bound to each individual mystery box item as it is created and added to the DOM
- When any mystery box is clicked, all item movement on the conveyor belt pauses immediately
- Clicked mystery box correctly triggers the ItemModal component display with proper state management
- Modal component properly appears and is visible when triggered with correct React state updates
- Item click handler correctly updates the modal state by setting the selected item data and triggering the modal's `isModalOpen` state to `true`
- ItemModal component properly rendered in the React component tree and receives valid props including `isOpen`, `onOpenChange`, and `item`
- ItemModal component must properly handle the `isOpen` prop to control visibility and `onOpenChange` callback to manage state changes
- Background blur effect applies when the modal is visible and modal content appears centered above the blurred background
- Enhanced modal window shows detailed information about the clicked item including its rarity and name
- Modal window features festive Christmas-themed design with decorative borders, glowing snowflake icons, and warm color palette
- Unique color schemes and accent effects for each rarity tier within the modal matching their item glow colors
- Prominent "Buy" button styled with festive UI including gold accent, hover effects, and rounded corners
- Purchase functionality that stores selected items in user profile using frontend storage
- Visual purchase confirmation with festive animations such as sparkle or confetti burst effects
- Close button in modal that resumes conveyor movement when activated by setting `isModalOpen` to `false`
- Modal visibly appears with proper transitions and maintains festive UI consistency
- Game state preservation during pause and resume cycles with reliable conveyor belt motion control
- All item movement animations pause when modal is open and resume when modal is closed
- Each mystery box element must have properly functioning click event handlers that correctly trigger the modal system
- Click event handling must work reliably for dynamically spawned mystery box items throughout their movement lifecycle
- Modal closes via background click, Escape key press, or Close button interaction
- Modal backdrop blur effect and event handling remain consistent with Christmas-themed UI

## User Profile System
- Frontend-based user profile storage for purchased items
- Item collection tracking and storage using browser local storage or session state
- Purchase history maintained in frontend state
- No authentication required - uses mock user profile system

## Technical Requirements
- Frontend-only application using HTML, CSS, and JavaScript
- JavaScript-based item spawning system with intelligent spacing control and timer functionality
- Smooth animation system for item movement across the conveyor belt from right to left
- Proper React state management for modal open/close functionality using `isModalOpen` state
- Reliable click event handling system with proper event listener attachment for mystery box interaction
- Event listeners must be attached to each mystery box item immediately upon creation and DOM insertion
- Enhanced modal window implementation with festive styling and purchase functionality that correctly appears when triggered
- ItemModal component must properly implement `isOpen` and `onOpenChange` props for state management
- ItemModal component integrates seamlessly with existing state management system in ConveyorBelt.tsx
- Modal triggers work correctly: clicking mystery box opens modal with item details
- Modal closes properly via background click, Escape key, or Close button
- Purchase system with frontend storage for user profile and item collection
- Visual confirmation animations for successful purchases
- Configurable movement speed variable for easy future adjustments
- CSS styling for rarity-based visual effects, enhanced modal presentation, and festive animations
- CSS 3D effects for mystery box appearance including shadows, gradients, and perspective transforms
- Animation system that maintains responsive layout integrity
- Backend storage for user profiles and purchased items
- No authentication required
- Responsive design implementation
- English language content
- Game state maintained in frontend only with purchase data persisted in backend
- Proper React component integration and state management for modal functionality with correct prop passing and state updates
- Animation pause/resume functionality tied to modal state
- "Arcade Classic" font implementation across all components
- Correct event delegation or direct event binding to ensure click functionality works for all spawned mystery box items

## User Interface
- Single page displaying the "GiftStream" title at the top of the page layout
- Centered conveyor belt with spawned and moving mystery box items
- Help text underneath the conveyor belt: "Click on a mystery box to unbox it!"
- Christmas-themed background that remains dominant and visible behind the conveyor belt without transparent overlay
- Mystery box items visually integrated within the conveyor belt container with smooth right-to-left movement and proper spacing
- Clean and minimal visual presentation with rarity-based color coding
- Layout adjusted for visual balance without header component
- Small, centered footer with muted text styling
- Enhanced centered modal window with festive Christmas design elements that properly appears when items are clicked
- Decorative borders, glowing snowflake icons, and warm color palette in modal
- Rarity-specific color schemes and accent effects within modal
- Prominent "Buy" button with festive styling and interactive effects
- Visual purchase confirmation animations
- Modal close button functionality that properly manages state
- Animations that seamlessly integrate with the existing Christmas-themed UI
- Modal transitions and visibility work reliably with consistent festive styling
- Consistent "Arcade Classic" font styling throughout the application
- Overall layout spacing and responsiveness preserved while maintaining the festive Christmas theme
- Modal styling, backdrop blur, and event handling consistent with Christmas-themed UI

## Future Extensibility
The foundation is designed to support future additions of:
- Item collection and interaction mechanics
- Advanced game systems and progression
- Item management and inventory features
- Enhanced animation effects and visual improvements
- User authentication and persistent profiles
- Advanced purchase and collection systems
