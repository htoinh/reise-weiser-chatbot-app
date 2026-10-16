import 'styled-components';
import type { AppTheme } from './theme';
declare module 'styled-components' {
    export interface DefaultTheme {
        colors: AppTheme ["colors"];
        fontFamily: AppTheme ["fontFamily"];
    }
    export interface DefaultTheme extends AppTheme {}
}