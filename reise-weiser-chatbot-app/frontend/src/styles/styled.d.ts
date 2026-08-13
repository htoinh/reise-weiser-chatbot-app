import 'styled-components';
import type { AppTheme } from './theme';
declare module 'styled-components' {
    // Required for styled-components theme typing via module augmentation.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DefaultTheme extends AppTheme {}
}