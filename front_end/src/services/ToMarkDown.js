export const formatTextToMarkdown = (text) => {
        if (!text) return '';
        
        let formattedText = text;
        const lines = text.split('\n');
        let inList = false;
        
        formattedText = lines.map((line, index) => {
            // Trim the line
            line = line.trim();
            
            // Skip empty lines
            if (!line) return '';
            
            // Check if line starts with a number followed by a period (potential numbered list)
            if (/^\d+\.\s/.test(line)) {
                inList = true;
                return line; // Keep the existing numbering
            }
            
            // Check if line starts with dash or asterisk (potential bullet list)
            if (/^[-*]\s/.test(line)) {
                inList = true;
                return line; // Keep the existing bullet
            }
            
            // If it's a short line (less than 50 chars) and not part of a list, treat as a heading
            if (line.length < 50 && !inList && index > 0) {
                return `\n## ${line}\n`;
            }
            
            // If line starts with "Note:" or "Important:", make it bold
            if (line.startsWith('Note:') || line.startsWith('Important:')) {
                return `\n**${line}**\n`;
            }
            
            // Add spacing between paragraphs
            return index === 0 ? line : `\n${line}`;
        }).join('\n');

        // Add some basic formatting
        // Convert URLs to markdown links
        formattedText = formattedText.replace(
            /(https?:\/\/[^\s]+)/g,
            '[$1]($1)'
        );

        // Convert simple emphasis
        formattedText = formattedText
            .replace(/\*\*(.*?)\*\*/g, '**$1**')  // Keep existing bold
            .replace(/\*(.*?)\*/g, '*$1*')        // Keep existing italic
            .replace(/_([^_]+)_/g, '*$1*');       // Convert underscores to italic

        // Add a note about markdown support at the end
        formattedText += '\n\n---\n*This content supports Markdown formatting.*';

        return formattedText;
    };