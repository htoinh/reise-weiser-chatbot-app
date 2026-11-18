import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ChatInput from '../components/ChatInput';
import { renderWithProviders } from './testUtils';

describe('ChatInput.tsx', () => {
    it('displays prompt textarea and enabled Send button by default', () => {
        renderWithProviders(<ChatInput onSend={vi.fn()} />);

        expect(screen.getByLabelText('Chat prompt')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
    });

    it('disables Send button while API call is in progress and re-enables when completed', () => {
        const { rerender } = renderWithProviders(<ChatInput onSend={vi.fn()} disabled={true} />);

        const sendingBtn = screen.getByRole('button', { name: 'Sending...' });
        expect(sendingBtn).toBeDisabled();
        expect(sendingBtn).toHaveAttribute('aria-busy', 'true');

        rerender(<ChatInput onSend={vi.fn()} disabled={false} />);
        expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
    });

    it('submits trimmed user input on button click and clears textarea', async () => {
        const user = userEvent.setup();
        const onSend = vi.fn();
        renderWithProviders(<ChatInput onSend={onSend} />);

        const textarea = screen.getByLabelText('Chat prompt');
        await user.type(textarea, '  Best beaches in Portugal?  ');
        await user.click(screen.getByRole('button', { name: 'Send' }));

        expect(onSend).toHaveBeenCalledTimes(1);
        expect(onSend).toHaveBeenCalledWith('Best beaches in Portugal?');
        expect(textarea).toHaveValue('');
    });

    it('submits on Enter, allows Shift+Enter newline, and ignores blank or disabled submissions', async () => {
        const user = userEvent.setup();
        const onSend = vi.fn();
        renderWithProviders(<ChatInput onSend={onSend} />);

        const textarea = screen.getByLabelText('Chat prompt');

        await user.type(textarea, '   {Enter}');
        expect(onSend).not.toHaveBeenCalled();

        await user.clear(textarea);
        await user.type(textarea, 'Line one{Shift>}{Enter}{/Shift}Line two');
        expect(onSend).not.toHaveBeenCalled();
        expect(textarea).toHaveValue('Line one\nLine two');

        await user.type(textarea, '{Enter}');
        expect(onSend).toHaveBeenCalledTimes(1);
        expect(onSend).toHaveBeenCalledWith('Line one\nLine two');
        expect(textarea).toHaveValue('');
    });
});
