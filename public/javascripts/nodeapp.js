import '../sass/style.scss';

import { $, $$ } from './bling';

import autocomplete from './modules/autocomplete';


autocomplete( $('#address'), $('#lat'), $('#lng') );
