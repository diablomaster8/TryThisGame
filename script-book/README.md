# Grove script book

Generated from `src/content/` by `tests/tools/script-book.ts`; never edit by hand. Rerun it after any content change and check with `--check`.

One storyline per file, scenes in play order. Variants sit under their parent scene ("Variant of …"); variants with no parent close their storyline's file. Learning Grove versions are separate files, one per band, each scene linking to its main scene. No file runs past 3500 lines; longer ones split at their `##` headings into `-1`, `-2`. Each file is one review unit (`docs/story-review/LOG.md`).

`ids.tsv` maps every scene id to its book file:line and its source file:line. Line counts are in brackets.

For one file per line to read straight through (gitignored): `npx tsx tests/tools/script-book.ts --whole script-book-whole`.

## Hazel's Grove

| Storyline | Script | Little Sprouts | Grove Readers |
| --- | --- | --- | --- |
| The campaign, Book 1: The Letter | [book-1.md](campaign/book-1.md) (494) |  |  |
| The campaign, Book 2: The Cold | [book-2.md](campaign/book-2.md) (580) |  |  |
| The campaign, Book 3: The Long Night | [book-3.md](campaign/book-3.md) (1152) |  |  |
| The campaign: triggered scenes | [triggered.md](campaign/triggered.md) (75) |  |  |
| The campaign: endings | [endings.md](campaign/endings.md) (366) |  |  |
| Side story S1: The Wardens’ Walk · opens in chapter 4 | [S01.md](side/S01.md) (202) | [sprout.md](learning/side/S01/sprout.md) (249) | [reader.md](learning/side/S01/reader.md) (336) |
| Side story S2: Wisp · opens in chapter 3 | [S02.md](side/S02.md) (207) | [sprout.md](learning/side/S02/sprout.md) (220) | [reader.md](learning/side/S02/reader.md) (319) |
| Side story S3: The Cycle · opens in chapter 4 | [S03.md](side/S03.md) (178) | [sprout.md](learning/side/S03/sprout.md) (219) | [reader.md](learning/side/S03/reader.md) (282) |
| Side story S4: The Wellspring · opens in chapter 5 | [S04.md](side/S04.md) (152) | [sprout.md](learning/side/S04/sprout.md) (194) | [reader.md](learning/side/S04/reader.md) (259) |
| Side story S5: Fossil’s Last Walk · opens in chapter 5 | [S05.md](side/S05.md) (146) | [sprout.md](learning/side/S05/sprout.md) (186) | [reader.md](learning/side/S05/reader.md) (258) |
| Side story S6: Ash’s True Name · opens in chapter 9 | [S06.md](side/S06.md) (163) | [sprout.md](learning/side/S06/sprout.md) (193) | [reader.md](learning/side/S06/reader.md) (238) |
| Side story S7: Unverified · opens in chapter 7 | [S07.md](side/S07.md) (164) | [sprout.md](learning/side/S07/sprout.md) (192) | [reader.md](learning/side/S07/reader.md) (265) |
| Side story S8: The Warren in the Hollow · opens in chapter 8 | [S08.md](side/S08.md) (178) | [sprout.md](learning/side/S08/sprout.md) (225) | [reader.md](learning/side/S08/reader.md) (302) |
| Side story S9: The Gate That Sticks · opens in chapter 11 | [S09.md](side/S09.md) (198) | [sprout.md](learning/side/S09/sprout.md) (219) | [reader.md](learning/side/S09/reader.md) (312) |
| Side story S10: Fourteen Months · opens in chapter 11 | [S10.md](side/S10.md) (387) | [sprout.md](learning/side/S10/sprout.md) (478) | [reader.md](learning/side/S10/reader.md) (563) |
| Side story S11: The Blight · opens in chapter 5 | [S11.md](side/S11.md) (168) | [sprout.md](learning/side/S11/sprout.md) (212) | [reader.md](learning/side/S11/reader.md) (305) |
| Side story S12: The Hum · opens in chapter 6 | [S12.md](side/S12.md) (172) | [sprout.md](learning/side/S12/sprout.md) (209) | [reader.md](learning/side/S12/reader.md) (297) |
| Side story S13: The Mill Cellar · opens in chapter 7 | [S13.md](side/S13.md) (339) | [sprout.md](learning/side/S13/sprout.md) (361) | [reader.md](learning/side/S13/reader.md) (542) |
| Side story S14: Tilly’s Tabletop · opens in chapter 8 | [S14.md](side/S14.md) (218) | [sprout.md](learning/side/S14/sprout.md) (262) | [reader.md](learning/side/S14/reader.md) (343) |
| Side story S15: Lucky Eggs · opens in chapter 5 | [S15.md](side/S15.md) (170) | [sprout.md](learning/side/S15/sprout.md) (211) | [reader.md](learning/side/S15/reader.md) (307) |
| Side story S16: The Workyard · opens in chapter 6 | [S16.md](side/S16.md) (159) | [sprout.md](learning/side/S16/sprout.md) (196) | [reader.md](learning/side/S16/reader.md) (285) |
| Side story S17: Nightjar · opens in chapter 7 | [S17.md](side/S17.md) (176) | [sprout.md](learning/side/S17/sprout.md) (235) | [reader.md](learning/side/S17/reader.md) (318) |
| Side story S18: The Grove Museum · opens in chapter 6 | [S18.md](side/S18.md) (191) | [sprout.md](learning/side/S18/sprout.md) (258) | [reader.md](learning/side/S18/reader.md) (343) |
| Side story S19: Cinder’s Last Light · opens in chapter 11 | [S19.md](side/S19.md) (427) | [sprout.md](learning/side/S19/sprout.md) (439) | [reader.md](learning/side/S19/reader.md) (608) |
| Side story S20: Fort Night · opens in chapter 11 | [S20.md](side/S20.md) (182) | [sprout.md](learning/side/S20/sprout.md) (220) | [reader.md](learning/side/S20/reader.md) (306) |
| Side story S21: CL-4NK · opens in chapter 3 | [S21.md](side/S21.md) (185) | [sprout.md](learning/side/S21/sprout.md) (222) | [reader.md](learning/side/S21/reader.md) (309) |
| Side story S22: The Climb · opens in chapter 8 | [S22.md](side/S22.md) (150) | [sprout.md](learning/side/S22/sprout.md) (188) | [reader.md](learning/side/S22/reader.md) (280) |
| Side story S23: Three Visitors · opens in chapter 9 | [S23.md](side/S23.md) (742) |  |  |
| Side story S24: The Adventure Book · opens post-game | [S24.md](side/S24.md) (813) | [sprout.md](learning/side/S24/sprout.md) (1167) | [reader.md](learning/side/S24/reader.md) (1255) |
| Side story S25: Real · opens in chapter 3 | [S25.md](side/S25.md) (596) | [sprout.md](learning/side/S25/sprout.md) (897) | [reader.md](learning/side/S25/reader.md) (880) |
| Side story S26: The Walled Garden · opens in chapter 6 | [S26.md](side/S26.md) (622) | [sprout.md](learning/side/S26/sprout.md) (829) | [reader.md](learning/side/S26/reader.md) (992) |
| Side story S27: Some Nubbin · opens in chapter 5 | [S27.md](side/S27.md) (573) | [sprout.md](learning/side/S27/sprout.md) (757) | [reader.md](learning/side/S27/reader.md) (880) |
| Side story S28: Please Look After This Nubbin · opens in chapter 8 | [S28.md](side/S28.md) (582) | [sprout.md](learning/side/S28/sprout.md) (794) | [reader.md](learning/side/S28/reader.md) (859) |
| Side story S29: The Gates of Dawn · opens in chapter 4 | [S29.md](side/S29.md) (665) | [sprout.md](learning/side/S29/sprout.md) (814) | [reader.md](learning/side/S29/reader.md) (1034) |
| Side story S30: What Sad Is For · opens in chapter 6 | [S30.md](side/S30.md) (554) | [sprout.md](learning/side/S30/sprout.md) (772) | [reader.md](learning/side/S30/reader.md) (892) |
| Side story S31: The Great Gourd · opens in chapter 7 | [S31.md](side/S31.md) (617) | [sprout.md](learning/side/S31/sprout.md) (851) | [reader.md](learning/side/S31/reader.md) (920) |
| Learning Grove: the campaign | | [sprout.md](learning/campaign/sprout.md) (2829) | [reader-1.md](learning/campaign/reader-1.md) (2556), [reader-2.md](learning/campaign/reader-2.md) (1381) |

## Fun quests

| Storyline | Script | Little Sprouts | Grove Readers |
| --- | --- | --- | --- |
| Fun quests: Monty Python (Q1–Q20) | [python.md](fun/python.md) (1838) | [sprout.md](learning/fun/python/sprout.md) (2201) | [reader.md](learning/fun/python/reader.md) (2835) |
| Fun quests: Mr. Bean (Q21–Q30) | [bean.md](fun/bean.md) (822) | [sprout.md](learning/fun/bean/sprout.md) (998) | [reader.md](learning/fun/bean/reader.md) (1354) |
| Fun quests: It's Always Sunny (Q31–Q45, adults only) | [sunny.md](fun/sunny.md) (1372) |  |  |
| Fun quests: Avatar: The Last Airbender (Q46–Q65) | [avatar.md](fun/avatar.md) (1864) | [sprout.md](learning/fun/avatar/sprout.md) (2330) | [reader.md](learning/fun/avatar/reader.md) (3011) |
| Fun quests: Alice in Wonderland (Q66–Q75) | [alice.md](fun/alice.md) (808) |  |  |
| Fun quests: Sherlock Holmes (Q76–Q85) | [holmes.md](fun/holmes.md) (858) |  |  |
| Fun quests: Nasreddin Hodja (Q86–Q95) | [hodja.md](fun/hodja.md) (756) |  |  |

## Neopia

| Storyline | Script |
| --- | --- |
| Neopia line (NP1–NP13) | [line.md](neopia/line.md) (1876) |
| Neopia quests (NQ1–NQ32) | [quests.md](neopia/quests.md) (1850) |

## Multiverse

| Storyline | Script |
| --- | --- |
| Multiverse: Iron Man (IM1–IM15) | [ironman.md](multiverse/ironman.md) (1919) |
| Multiverse: Captain America (CA1–CA10) | [cap.md](multiverse/cap.md) (1139) |
| Multiverse: Doom and the Fantastic Four (FF1–FF10) | [doom.md](multiverse/doom.md) (1248) |
| Multiverse: Ultron (UL1–UL10) | [ultron.md](multiverse/ultron.md) (1080) |
| Multiverse: Moon Knight (MK1–MK8) | [moonknight.md](multiverse/moonknight.md) (956) |
| Multiverse: Spawn (SP1–SP8) | [spawn.md](multiverse/spawn.md) (894) |
| Multiverse: Dragon Ball (DB1–DB20) | [dragonball.md](multiverse/dragonball.md) (2253) |
| Multiverse: Toy Story (TS1–TS12) | [toystory.md](multiverse/toystory.md) (1441) |
| Multiverse: Endgames (E1–E6) | [endgames.md](multiverse/endgames.md) (1592) |

## Expansions

| Storyline | Script |
| --- | --- |
| Expansion E1: The Square | [E1.md](expansions/E1.md) (182) |
| Expansion E2: Nova’s Season | [E2.md](expansions/E2.md) (156) |
| Expansion E3: The Twine | [E3.md](expansions/E3.md) (152) |

## Storylines

| Storyline | Script |
| --- | --- |
| Storyline SL1: The Hundred Days | [hundred.md](storylines/hundred.md) (439) |
| Storyline SL2: Logged In | [logged.md](storylines/logged.md) (363) |
| Storyline SL3: The Beetle Road | [beetle.md](storylines/beetle.md) (385) |
| Storyline SL4: Dawn & Dusk | [dawndusk.md](storylines/dawndusk.md) (517) |

## Atlas

| Storyline | Script | Little Sprouts | Grove Readers |
| --- | --- | --- | --- |
| Atlas, page A1: The Brothers’ Bargain | [main.md](atlas/A01/main.md) (1627) |  |  |
| Atlas, page A2: The Monkey and the Monk | [main.md](atlas/A02/main.md) (1607) | [sprout.md](atlas/A02/sprout.md) (1957) | [reader.md](atlas/A02/reader.md) (2317) |
| Atlas, page A3: Forty-Nine Days | [main.md](atlas/A03/main.md) (1208) |  |  |
| Atlas, page A4: The Waterfall Prince | [main.md](atlas/A04/main.md) (1351) |  |  |
| Atlas, page A5: The Lion of Mali | [main.md](atlas/A05/main.md) (1318) | [sprout.md](atlas/A05/sprout.md) (1622) | [reader.md](atlas/A05/reader.md) (1922) |
| Atlas, page A6: Seven Voyages | [main.md](atlas/A06/main.md) (1545) | [sprout.md](atlas/A06/sprout.md) (1887) | [reader.md](atlas/A06/reader.md) (2232) |
| Atlas, page A7: The Marigold Bridge | [main.md](atlas/A07/main.md) (1211) | [sprout.md](atlas/A07/sprout.md) (1533) | [reader.md](atlas/A07/reader.md) (1868) |
| Atlas, page A8: The Twelve Tasks | [main.md](atlas/A08/main.md) (1085) | [sprout.md](atlas/A08/sprout.md) (1263) | [reader.md](atlas/A08/reader.md) (1441) |
| Atlas, page A9: The Comet | [main.md](atlas/A09/main.md) (1135) | [sprout.md](atlas/A09/sprout.md) (1491) | [reader.md](atlas/A09/reader.md) (1746) |
| Atlas, page A10: The Heart of the Island | [main.md](atlas/A10/main.md) (1306) | [sprout.md](atlas/A10/sprout.md) (1708) | [reader.md](atlas/A10/reader.md) (1932) |
| Atlas, page A11: The Enchanted Place | [main.md](atlas/A11/main.md) (1892) | [sprout.md](atlas/A11/sprout.md) (2366) | [reader.md](atlas/A11/reader.md) (2531) |
| Atlas, page A12: The Mirror Shard | [main.md](atlas/A12/main.md) (1976) | [sprout.md](atlas/A12/sprout.md) (2427) | [reader.md](atlas/A12/reader.md) (2748) |
| Atlas, page A13: The Wooden Boy | [main.md](atlas/A13/main.md) (1896) | [sprout.md](atlas/A13/sprout.md) (2334) | [reader.md](atlas/A13/reader.md) (2762) |
| Atlas, page A14: Homecoming | [main.md](atlas/A14/main.md) (2247) | [sprout.md](atlas/A14/sprout.md) (2772) | [reader.md](atlas/A14/reader.md) (3336) |
| Atlas, page A15: The Humbug | [main.md](atlas/A15/main.md) (2307) | [sprout.md](atlas/A15/sprout.md) (2872) | [reader.md](atlas/A15/reader.md) (3446) |
| Atlas, page A16: The Fox and the Rose | [main.md](atlas/A16/main.md) (1647) |  | [reader.md](atlas/A16/reader.md) (1860) |
| Atlas, page A17: The Camphor Tree | [main.md](atlas/A17/main.md) (1647) | [sprout.md](atlas/A17/sprout.md) (1940) | [reader.md](atlas/A17/reader.md) (2607) |
| Atlas, page A18: The Doll in the Pocket | [main.md](atlas/A18/main.md) (1749) | [sprout.md](atlas/A18/sprout.md) (2326) | [reader.md](atlas/A18/reader.md) (2530) |
| Atlas, page A19: The Dragon Who Fell | [main.md](atlas/A19/main.md) (1619) | [sprout.md](atlas/A19/sprout.md) (2003) | [reader.md](atlas/A19/reader.md) (2305) |
| Atlas, page A20: The Weeping | [main.md](atlas/A20/main.md) (1506) | [sprout.md](atlas/A20/sprout.md) (1834) | [reader.md](atlas/A20/reader.md) (2099) |
| Atlas, page A21: The Flower Field | [main.md](atlas/A21/main.md) (2072) |  |  |
| Atlas, page A22: The Candle | [main.md](atlas/A22/main.md) (1610) | [sprout.md](atlas/A22/sprout.md) (2016) | [reader.md](atlas/A22/reader.md) (2124) |
| Atlas, page A23: Remember Who You Are | [main.md](atlas/A23/main.md) (1692) | [sprout.md](atlas/A23/sprout.md) (1764) | [reader.md](atlas/A23/reader.md) (2185) |
| Atlas, page A24: The Law of the Jungle | [main.md](atlas/A24/main.md) (1943) | [sprout.md](atlas/A24/sprout.md) (2595) | [reader.md](atlas/A24/reader.md) (3062) |
| Atlas, page A25: The Nothing | [main.md](atlas/A25/main.md) (1729) |  | [reader.md](atlas/A25/reader.md) (1678) |
| Atlas, page A26: The Wall of Uruk | [main.md](atlas/A26/main.md) (1724) | [sprout.md](atlas/A26/sprout.md) (2192) | [reader.md](atlas/A26/reader.md) (2288) |
| Atlas, page A27: The White-Haired Prince | [main.md](atlas/A27/main.md) (1706) | [sprout.md](atlas/A27/sprout.md) (2211) | [reader.md](atlas/A27/reader.md) (2558) |
| Atlas, page A28: The Box of Stories | [main.md](atlas/A28/main.md) (1258) | [sprout.md](atlas/A28/sprout.md) (1750) | [reader.md](atlas/A28/reader.md) (1927) |
| Atlas, page A29: The Honmoon | [main.md](atlas/A29/main.md) (1415) |  | [reader.md](atlas/A29/reader.md) (2087) |
| Atlas, page A30: The Word on the Brow | [main.md](atlas/A30/main.md) (1096) | [sprout.md](atlas/A30/sprout.md) (1424) | [reader.md](atlas/A30/reader.md) (1466) |
| Atlas, page A31: The Hero Twins | [main.md](atlas/A31/main.md) (1665) | [sprout.md](atlas/A31/sprout.md) (1889) | [reader.md](atlas/A31/reader.md) (1938) |

## Pixel's Arcade

| Storyline | Script | Little Sprouts | Grove Readers |
| --- | --- | --- | --- |
| Pixel's Arcade, cartridge PA1: The Chao Altar | [main.md](arcade/PA1/main.md) (1450) | [sprout.md](arcade/PA1/sprout.md) (1826) | [reader.md](arcade/PA1/reader.md) (2045) |
| Pixel's Arcade, cartridge PA2: The Clone Island | [main.md](arcade/PA2/main.md) (1523) |  |  |
| Pixel's Arcade, cartridge PA3: The Hollow Kingdom | [main.md](arcade/PA3/main.md) (1574) |  |  |
| Pixel's Arcade, cartridge PA4: Mercy | [main.md](arcade/PA4/main.md) (1693) |  |  |
| Pixel's Arcade, cartridge PA5: The Hundred-Year Sleep | [main.md](arcade/PA5/main.md) (1613) |  |  |

## Learning Grove lines

| Storyline | Script | Little Sprouts | Grove Readers |
| --- | --- | --- | --- |
| Learning Grove line LB: Play (LB1–LB12) | [main.md](lines/LB/main.md) (1024) | [sprout.md](lines/LB/sprout.md) (1208) | [reader.md](lines/LB/reader.md) (1346) |
| Learning Grove line LK: Mouse-Deer (LK1–LK10) | [main.md](lines/LK/main.md) (736) | [sprout.md](lines/LK/sprout.md) (818) | [reader.md](lines/LK/reader.md) (975) |
| Ori's Alef-Bet, Hebrew (LH1–LH6) | [main.md](lines/lang-hebrew/main.md) (710) | [sprout.md](lines/lang-hebrew/sprout.md) (1051) | [reader.md](lines/lang-hebrew/reader.md) (1274) |
| Ori's Alef-Bet: word list and script primer | [words.md](lines/lang-hebrew/words.md) (111) |  |  |
| Hana's Hiragana, Japanese (LJ1–LJ6) | [main.md](lines/lang-japanese/main.md) (798) | [sprout.md](lines/lang-japanese/sprout.md) (1016) | [reader.md](lines/lang-japanese/reader.md) (1215) |
| Hana's Hiragana: word list and script primer | [words.md](lines/lang-japanese/words.md) (110) |  |  |

## Extras

| Storyline | Script |
| --- | --- |
| Readers: fortune teller, doctor, Aunt Wen, Island Mystic, the kings | [readers.md](extras/readers.md) (367) |
| Result lines for every result screen and Neopia freebie | [results.md](extras/results.md) (543) |
