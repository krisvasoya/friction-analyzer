export const featuresData = [
    {
        id: 'heatmap-analysis',
        title: 'Heatmap Analysis',
        description: 'Visualize user engagement with precise click, scroll, and movement heatmaps.',
        icon: '🔥',
        fullDescription: `
            Our Heatmap Analysis tool provides a visual representation of how users interact with your website. 
            By aggregating data from thousands of sessions, we generate color-coded maps that show you exactly where users are clicking, how far they are scrolling, and where their mouse attention is focused.
        `,
        benefits: [
            'Identify the most popular elements on your pages.',
            'Discover how far users scroll and where they lose interest.',
            'Optimize call-to-action placement for maximum conversions.',
            'Detect broken links or non-clickable elements that users are trying to interact with.'
        ],
        howItWorks: 'We track every mouse click, movement, and scroll event. This data is processed in real-time to generate overlay maps on your actual website interface, allowing for immediate visual insights.'
    },
    {
        id: 'session-replay',
        title: 'Session Replay',
        description: 'Watch pixel-perfect replays of user sessions to understand frustration.',
        icon: '🎥',
        fullDescription: `
            Session Replay is like looking over your user's shoulder. It records the DOM mutations, mouse movements, and interactions, allowing you to replay the exact experience a user had on your site. 
            This is crucial for reproducing bugs and understanding the "why" behind user actions.
        `,
        benefits: [
            'Reproduce bugs faster by seeing exactly what the user did.',
            'Understand user confusion and hesitation.',
            'Analyze onboarding flows and checkout processes.',
            'Validate UX design decisions with real-world usage data.'
        ],
        howItWorks: 'The recorder captures the initial HTML state and subsequent changes (DOM mutations). It essentially records the "instructions" to rebuild the page, not a video, making it lightweight and performant.'
    },
    {
        id: 'funnel-insights',
        title: 'Funnel Insights',
        description: 'Identify exactly where users drop off in your conversion funnels.',
        icon: '📉',
        fullDescription: `
            Funnel Insights allow you to define a series of steps you expect users to take (e.g., Landing Page -> Product Page -> Add to Cart -> Checkout). 
            We track how many users make it from one step to the next and identify the exact step where you are losing the most potential customers.
        `,
        benefits: [
            'Pinpoint the exact page causing the most drop-offs.',
            'Compare conversion rates across different segments (mobile vs. desktop).',
            'A/B test different flows to optimize conversion.',
            'Calculate the ROI of your UX improvements.'
        ],
        howItWorks: 'Define your funnel steps using URLs or custom events. Our analytics engine queries the session data to calculate conversion rates and drop-off percentages for each stage.'
    },
    {
        id: 'ai-recommendations',
        title: 'AI Recommendations',
        description: 'Get actionable suggestions to improve UX and reduce friction automatically.',
        icon: '🤖',
        fullDescription: `
            Leverage the power of Machine Learning to automatically detect patterns of friction. 
            Our AI analyzes session data to find anomalies, such as high rage click rates on specific buttons or unusual navigation loops, and suggests specific improvements.
        `,
        benefits: [
            'Save time analyzing mountains of data.',
            'Get proactive alerts about UX degradation.',
            'Receive data-backed recommendations for design changes.',
            'Continuously monitor UX health 24/7.'
        ],
        howItWorks: 'Our ML models are trained on millions of interaction points to recognize patterns associated with user frustration. When these patterns exceeding a threshold, an insight is generated.'
    },
    {
        id: 'frustration-detection',
        title: 'Frustration Detection',
        description: 'Automatically flag rage clicks, dead clicks, and confused scrolling.',
        icon: '😡',
        fullDescription: `
            Don't wait for support tickets to know your users are unhappy. 
            Frustration Detection automatically identifying behaviors like "Rage Clicks" (rapidly clicking the same element), "Dead Clicks" (clicking on un-clickable elements), and "Bird's Nesting" (erratic mouse movement).
        `,
        benefits: [
            'Identify broken UI elements immediately.',
            'Prioritize fixes based on frustration impact.',
            'Quantify the "Friction Score" of your application.',
            'Recover frustrated users with real-time interventions.'
        ],
        howItWorks: 'Heuristic algorithms run in the user\'s browser to detect specific patterns of events (e.g., 5 clicks in 500ms). These events are tagged to the session for easy filtering.'
    },
    {
        id: 'form-analytics',
        title: 'Form Analytics',
        description: 'Deep dive into form field interactions and abandonment reasons.',
        icon: '📝',
        fullDescription: `
            Forms are often the friction point in conversion workflows. 
            Form Analytics tracks interaction with every single input field, showing you which fields cause validation errors, which ones take the longest to fill, and which ones cause users to abandon the form entirely.
        `,
        benefits: [
            'Determine which fields are causing drop-offs.',
            'Identify confusing labels or strict validation rules.',
            'Optimize form structure for speed and ease of use.',
            'Increase form completion rates.'
        ],
        howItWorks: 'We attach listeners to all form elements. We track focus time, typing duration, correction rates (backspaces/deletes), and the last focused field before abandonment.'
    },
    {
        id: 'user-journeys',
        title: 'User Journeys',
        description: 'Map out the entire path users take through your application.',
        icon: '🗺️',
        fullDescription: `
            Visualize the most common paths users take through your site. 
            See how users navigate from the homepage to conversion, or where they go when they get lost. Sunburst charts and flow diagrams help you understand the non-linear reality of user navigation.
        `,
        benefits: [
            'Discover unexpected navigation patterns.',
            'Optimize information architecture.',
            'Identify circular navigation loops indicating confusion.',
            'Validate if users are following your intended user flows.'
        ],
        howItWorks: 'We construct a directed graph of all page views in a session. Aggregating these graphs reveals the "highways" and "backroads" of your website traffic.'
    },
    {
        id: 'real-time-alerts',
        title: 'Real-time Alerts',
        description: 'Get notified immediately when critical friction events occur.',
        icon: '🔔',
        fullDescription: `
            Set up custom alerts for metrics that matter to you. 
            Receive a Slack message or email when your error rate spikes, when checkout conversion drops below a threshold, or when a high-value user encounters a rage click.
        `,
        benefits: [
            'React to issues before they impact revenue.',
            'Monitor the health of new deployments.',
            'Keep your team aligned on UX performance.',
            'Customize thresholds for different parts of your app.'
        ],
        howItWorks: 'Our stream processing engine evaluates incoming events against your defined rules in real-time. If a rule is triggered, a notification is dispatched via your configured channels.'
    },
    {
        id: 'team-collaboration',
        title: 'Team Collaboration',
        description: 'Share insights and annotated sessions with your product team.',
        icon: '👥',
        fullDescription: `
            UX is a team sport. 
            Our collaboration tools allow you to add comments to specific timestamps in session replays, share heatmaps with a public link, and export reports for executive presentations.
        `,
        benefits: [
            'Streamline communication between Design, Eng, and Product.',
            'Contextualize bug reports with video evidence.',
            'Build a shared understanding of user pain points.',
            'Track the resolution status of UX issues.'
        ],
        howItWorks: 'Insights and sessions are object-referenced. You can generate secure, shareable tokens to allow team members (or even external stakeholders) to view specific data points without full account access.'
    }
];
