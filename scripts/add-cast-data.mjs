import { readFileSync, writeFileSync } from 'fs';

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const castData = {
  // Films & TV – leadActors
  'fire-walk-with-me':                    { leadActors: ['Sheryl Lee', 'Kyle MacLachlan', 'Moira Kelly', 'Ray Wise', 'Kiefer Sutherland'] },
  'mulholland-dr':                        { leadActors: ['Naomi Watts', 'Laura Harring', 'Justin Theroux', 'Ann Miller', 'Robert Forster'] },
  'hereditary':                           { leadActors: ['Toni Collette', 'Alex Wolff', 'Milly Shapiro', 'Gabriel Byrne', 'Ann Dowd'] },
  'the-thing-1982':                       { leadActors: ['Kurt Russell', 'Wilford Brimley', 'T.K. Carter', 'David Clennon', 'Keith David'] },
  'barbie-2023':                          { leadActors: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera', 'Kate McKinnon', 'Simu Liu'] },
  'eraserhead-1977':                      { leadActors: ['Jack Nance', 'Charlotte Stewart', 'Allen Joseph', 'Jeanne Bates', 'Judith Anna Roberts'] },
  'groundhog-day-1993':                   { leadActors: ['Bill Murray', 'Andie MacDowell', 'Chris Elliott', 'Stephen Tobolowsky', 'Brian Doyle-Murray'] },
  'synecdoche-new-york':                  { leadActors: ['Philip Seymour Hoffman', 'Catherine Keener', 'Samantha Morton', 'Emily Watson', 'Dianne Wiest'] },
  'in-the-mood-for-love':                 { leadActors: ['Tony Leung Chiu-wai', 'Maggie Cheung', 'Rebecca Pan', 'Lai Chen'] },
  'stalker':                              { leadActors: ['Alexander Kaidanovsky', 'Anatoly Solonitsyn', 'Nikolai Grinko', 'Alisa Freyndlikh'] },
  'killers-of-the-flower-moon':           { leadActors: ['Leonardo DiCaprio', 'Lily Gladstone', 'Robert De Niro', 'Jesse Plemons', 'Tantoo Cardinal'] },
  'the-master':                           { leadActors: ['Joaquin Phoenix', 'Philip Seymour Hoffman', 'Amy Adams', 'Laura Dern', 'Jesse Plemons'] },
  'annihilation':                         { leadActors: ['Natalie Portman', 'Jennifer Jason Leigh', 'Gina Rodriguez', 'Tessa Thompson', 'Tuva Novotny'] },
  'possession':                           { leadActors: ['Isabelle Adjani', 'Sam Neill', 'Margit Carstensen', 'Heinz Bennent', 'Johanna Hofer'] },
  'eyes-wide-shut':                       { leadActors: ['Tom Cruise', 'Nicole Kidman', 'Sydney Pollack', 'Marie Richardson', 'Rade Šerbedžija'] },
  'tar':                                  { leadActors: ['Cate Blanchett', 'Nina Hoss', 'Sophie Kauer', 'Noémie Merlant', 'Mark Strong'] },
  'the-goonies-1985':                     { leadActors: ['Sean Astin', 'Josh Brolin', 'Jeff Cohen', 'Corey Feldman', 'Kerri Green'] },
  'fight-club-1999':                      { leadActors: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter', 'Meat Loaf', 'Jared Leto'] },
  'under-the-skin':                       { leadActors: ['Scarlett Johansson', 'Jeremy McWilliams', 'Lynsey Taylor Mackay', 'Joe Szula'] },
  'coherence-2013':                       { leadActors: ['Emily Baldoni', 'Maury Sterling', 'Nicholas Brendon', 'Elizabeth Gracen', 'Hugo Armstrong'] },
  'the-lighthouse-2019':                  { leadActors: ['Willem Dafoe', 'Robert Pattinson'] },
  'beyond-the-black-rainbow-2010':        { leadActors: ['Eva Allan', 'Michael Rogers', 'Scott Hylands', 'Marilyn Norry'] },
  'starship-troopers-1997':               { leadActors: ['Casper Van Dien', 'Dina Meyer', 'Denise Richards', 'Jake Busey', 'Neil Patrick Harris'] },
  'jennifers-body-2009':                  { leadActors: ['Megan Fox', 'Amanda Seyfried', 'Johnny Simmons', 'Adam Brody', 'J.K. Simmons'] },
  'secretary-2002':                       { leadActors: ['Maggie Gyllenhaal', 'James Spader', 'Jeremy Davies', 'Lesley Ann Warren'] },
  'donnie-darko-2001':                    { leadActors: ['Jake Gyllenhaal', 'Jena Malone', 'Mary McDonnell', 'Drew Barrymore', 'Patrick Swayze'] },
  'no-country-for-old-men-2007':          { leadActors: ['Josh Brolin', 'Tommy Lee Jones', 'Javier Bardem', 'Woody Harrelson', 'Kelly Macdonald'] },
  'django-unchained-2012':                { leadActors: ['Jamie Foxx', 'Christoph Waltz', 'Leonardo DiCaprio', 'Kerry Washington', 'Samuel L. Jackson'] },
  'inherent-vice-2014':                   { leadActors: ['Joaquin Phoenix', 'Josh Brolin', 'Owen Wilson', 'Reese Witherspoon', 'Benicio del Toro'] },
  'the-shining-1980':                     { leadActors: ['Jack Nicholson', 'Shelley Duvall', 'Danny Lloyd', 'Scatman Crothers', 'Barry Nelson'] },
  'beetlejuice-1988':                     { leadActors: ['Michael Keaton', 'Alec Baldwin', 'Geena Davis', 'Winona Ryder', 'Jeffrey Jones'] },
  'the-big-lebowski-1998':                { leadActors: ['Jeff Bridges', 'John Goodman', 'Julianne Moore', 'Steve Buscemi', 'John Turturro'] },
  'parasite-2019':                        { leadActors: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik', 'Park So-dam'] },
  'funny-games-1997':                     { leadActors: ['Susanne Lothar', 'Ulrich Mühe', 'Arno Frisch', 'Frank Giering', 'Stefan Clapczynski'] },
  'the-royal-tenenbaums-2001':            { leadActors: ['Gene Hackman', 'Anjelica Huston', 'Ben Stiller', 'Gwyneth Paltrow', 'Luke Wilson'] },
  'the-man-who-wasnt-there-2001':         { leadActors: ['Billy Bob Thornton', 'Frances McDormand', 'Michael Badalucco', 'James Gandolfini', 'Tony Shalhoub'] },
  'a-serious-man-2009':                   { leadActors: ['Michael Stuhlbarg', 'Richard Kind', 'Sari Lennick', 'Fred Melamed', 'Aaron Wolff'] },
  'primer-2004':                          { leadActors: ['Shane Carruth', 'David Sullivan', 'Casey Gooden', 'Anand Upadhyaya'] },
  '2001-a-space-odyssey-1968':            { leadActors: ['Keir Dullea', 'Gary Lockwood', 'William Sylvester', 'Leonard Rossiter', 'Douglas Rain'] },
  'the-blair-witch-project-1999':         { leadActors: ['Heather Donahue', 'Joshua Leonard', 'Michael C. Williams'] },
  'portrait-of-a-lady-on-fire-2019':      { leadActors: ['Noémie Merlant', 'Adèle Haenel', 'Luàna Bajrami', 'Valeria Golino'] },
  'barbarian-2022':                       { leadActors: ['Georgina Campbell', 'Bill Skarsgård', 'Justin Long', 'Matthew Patrick Davis'] },
  'idiocracy-2006':                       { leadActors: ['Luke Wilson', 'Maya Rudolph', 'Dax Shepard', 'Terry Crews', 'Anthony Campos'] },
  'persona-1966':                         { leadActors: ['Bibi Andersson', 'Liv Ullmann', 'Margaretha Krook', 'Gunnar Björnstrand'] },
  'the-seventh-seal-1957':                { leadActors: ['Max von Sydow', 'Gunnar Björnstrand', 'Bibi Andersson', 'Bengt Ekerot', 'Nils Poppe'] },
  'wild-strawberries-1957':               { leadActors: ['Victor Sjöström', 'Bibi Andersson', 'Ingrid Thulin', 'Gunnar Björnstrand', 'Max von Sydow'] },
  'breathless-1960':                      { leadActors: ['Jean-Paul Belmondo', 'Jean Seberg', 'Daniel Boulanger', 'Jean-Pierre Melville'] },
  'the-400-blows-1959':                   { leadActors: ['Jean-Pierre Léaud', 'Albert Rémy', 'Claire Maurier', 'Patrick Auffay', 'Guy Decomble'] },
  'solaris-1972':                         { leadActors: ['Natalya Bondarchuk', 'Donatas Banionis', 'Jüri Järvet', 'Anatoly Solonitsyn', 'Vladislav Dvorzhetsky'] },
  '8-and-a-half-1963':                    { leadActors: ['Marcello Mastroianni', 'Anouk Aimée', 'Claudia Cardinale', 'Sandra Milo', 'Barbara Steele'] },
  'vagabond-1985':                        { leadActors: ['Sandrine Bonnaire', 'Macha Méril', 'Stéphane Freiss', 'Yolande Moreau'] },
  'taxi-driver-1976':                     { leadActors: ['Robert De Niro', 'Jodie Foster', 'Cybill Shepherd', 'Harvey Keitel', 'Albert Brooks'] },
  'raging-bull-1980':                     { leadActors: ['Robert De Niro', 'Joe Pesci', 'Cathy Moriarty', 'Nicholas Colasanto', 'Theresa Saldana'] },
  'there-will-be-blood-2007':             { leadActors: ['Daniel Day-Lewis', 'Paul Dano', 'Kevin J. O\'Connor', 'Ciarán Hinds', 'Paul F. Tompkins'] },
  'magnolia-1999':                        { leadActors: ['Tom Cruise', 'Jason Robards', 'Julianne Moore', 'Philip Seymour Hoffman', 'William H. Macy'] },
  'se7en-1995':                           { leadActors: ['Brad Pitt', 'Morgan Freeman', 'Kevin Spacey', 'Gwyneth Paltrow', 'R. Lee Ermey'] },
  'zodiac-2007':                          { leadActors: ['Jake Gyllenhaal', 'Mark Ruffalo', 'Robert Downey Jr.', 'Anthony Edwards', 'Brian Cox'] },
  'blue-velvet-1986':                     { leadActors: ['Kyle MacLachlan', 'Isabella Rossellini', 'Dennis Hopper', 'Laura Dern', 'Hope Lange'] },
  'a-clockwork-orange-1971':              { leadActors: ['Malcolm McDowell', 'Patrick Magee', 'Michael Bates', 'Warren Clarke', 'Adrienne Corri'] },
  'full-metal-jacket-1987':               { leadActors: ['Matthew Modine', 'R. Lee Ermey', 'Vincent D\'Onofrio', 'Adam Baldwin', 'Dorian Harewood'] },
  'schindlers-list-1993':                 { leadActors: ['Liam Neeson', 'Ben Kingsley', 'Ralph Fiennes', 'Caroline Goodall', 'Jonathan Sagall'] },
  'the-witch':                            { leadActors: ['Anya Taylor-Joy', 'Ralph Ineson', 'Kate Dickie', 'Harvey Scrimshaw', 'Ellie Grainger'] },
  'midsommar-2019':                       { leadActors: ['Florence Pugh', 'Jack Reynor', 'Vilhelm Blomgren', 'William Jackson Harper', 'Will Poulter'] },
  'beau-is-afraid':                       { leadActors: ['Joaquin Phoenix', 'Patti LuPone', 'Amy Ryan', 'Nathan Lane', 'Armen Nahapetian'] },
  'suspiria-1977':                        { leadActors: ['Jessica Harper', 'Stefania Casini', 'Flavio Bucci', 'Miguel Bosé', 'Alida Valli'] },
  'videodrome-1983':                      { leadActors: ['James Woods', 'Sonja Smits', 'Deborah Harry', 'Peter Dvorsky', 'Les Carlson'] },
  'requiem-for-a-dream-2000':             { leadActors: ['Ellen Burstyn', 'Jared Leto', 'Jennifer Connelly', 'Marlon Wayans', 'Christopher McDonald'] },
  'mother':                               { leadActors: ['Jennifer Lawrence', 'Javier Bardem', 'Ed Harris', 'Michelle Pfeiffer', 'Domhnall Gleeson'] },
  'inland-empire':                        { leadActors: ['Laura Dern', 'Jeremy Irons', 'Justin Theroux', 'Harry Dean Stanton', 'Grace Zabriskie'] },
  'oldboy-2003':                          { leadActors: ['Choi Min-sik', 'Yoo Ji-tae', 'Kang Hye-jung', 'Chi Dae-han', 'Oh Dal-su'] },
  'akira-1988':                           { leadActors: ['Mitsuo Iwata', 'Nozomu Sasaki', 'Mami Koyama', 'Taro Ishida', 'Tessho Genda'] },
  'perfect-blue-1997':                    { leadActors: ['Junko Iwao', 'Rica Matsumoto', 'Shinpachi Tsuji', 'Masaaki Ōkura'] },
  'princess-mononoke-1997':               { leadActors: ['Yôji Matsuda', 'Yuriko Ishida', 'Yûko Tanaka', 'Kaoru Kobayashi', 'Masahiko Nishimura'] },
  'chungking-express-1994':               { leadActors: ['Tony Leung Chiu-wai', 'Faye Wong', 'Brigitte Lin', 'Takeshi Kaneshiro', 'Valerie Chow'] },
  'spirited-away-2001':                   { leadActors: ['Daveigh Chase', 'Suzanne Pleshette', 'Jason Marsden', 'Susan Egan', 'David Ogden Stiers'] },
  'paprika-2006':                         { leadActors: ['Megumi Hayashibara', 'Tôru Furuya', 'Katsunosuke Hori', 'Akio Ōtsuka'] },
  'get-out-2017':                         { leadActors: ['Daniel Kaluuya', 'Allison Williams', 'Catherine Keener', 'Bradley Whitford', 'LilRel Howery'] },
  'everything-everywhere-all-at-once-2022': { leadActors: ['Michelle Yeoh', 'Ke Huy Quan', 'Jamie Lee Curtis', 'Stephanie Hsu', 'James Hong'] },
  'the-zone-of-interest':                 { leadActors: ['Christian Friedel', 'Sandra Hüller', 'Johann Myers', 'Freya Kreutzkam'] },
  'melancholia':                          { leadActors: ['Kirsten Dunst', 'Charlotte Gainsbourg', 'Alexander Skarsgård', 'Kiefer Sutherland', 'Charlotte Rampling'] },
  'dogville-2003':                        { leadActors: ['Nicole Kidman', 'Paul Bettany', 'Lauren Bacall', 'James Caan', 'Patricia Clarkson'] },
  'cache-2005':                           { leadActors: ['Daniel Auteuil', 'Juliette Binoche', 'Maurice Bénichou', 'Annie Girardot'] },
  'phantom-thread-2017':                  { leadActors: ['Daniel Day-Lewis', 'Vicky Krieps', 'Lesley Manville', 'Camilla Rutherford'] },
  'a-woman-under-the-influence-1974':     { leadActors: ['Gena Rowlands', 'Peter Falk', 'Matthew Cassel', 'Matthew Laborteaux', 'Christina Grisanti'] },
  'the-tree-of-life':                     { leadActors: ['Brad Pitt', 'Sean Penn', 'Jessica Chastain', 'Hunter McCracken', 'Laramie Eppler'] },
  'megalopolis-2024':                     { leadActors: ['Adam Driver', 'Giancarlo Esposito', 'Nathalie Emmanuel', 'Forest Whitaker', 'Aubrey Plaza'] },
  'the-substance-2024':                   { leadActors: ['Demi Moore', 'Margaret Qualley', 'Dennis Quaid'] },
  'aftersun-2022':                        { leadActors: ['Paul Mescal', 'Frankie Corio', 'Celia Rowlson-Hall'] },
  'anora-2024':                           { leadActors: ['Mikey Madison', 'Yura Borisov', 'Aleksei Serebryakov', 'Karren Karagulian', 'Vache Tovmasyan'] },
  'joker-folie-a-deux-2024':              { leadActors: ['Joaquin Phoenix', 'Lady Gaga', 'Brendan Gleeson', 'Catherine Keener', 'Zazie Beetz'] },
  'sirat-2026':                           { leadActors: ['Ahmed Hammoud', 'Saadia Bentaïeb', 'Jalil Lespert'] },
  'bugonia-2025':                         { leadActors: ["O'Shea Jackson Jr.", 'Glenn Howerton', 'Megan Thee Stallion', 'Jennifer Coolidge'] },
  'mickey-17-2025':                       { leadActors: ['Robert Pattinson', 'Steven Yeun', 'Naomi Ackie', 'Toni Collette', 'Mark Ruffalo'] },
  'eddington-2025':                       { leadActors: ['Joaquin Phoenix', 'Pedro Pascal', 'Emma Stone', 'Austin Butler', 'Luke Grimes'] },
  'the-night-of-the-heron-2026':          { leadActors: ['Alba Rohrwacher', 'Yile Yara Vianello', 'Carol Duarte', 'Josh O\'Connor'] },
  'civil-war-2024':                       { leadActors: ['Kirsten Dunst', 'Wagner Moura', 'Cailee Spaeny', 'Stephen McKinley Henderson', 'Jesse Plemons'] },
  'nosferatu-2024':                       { leadActors: ['Bill Skarsgård', 'Lily-Rose Depp', 'Willem Dafoe', 'Nicholas Hoult', 'Aaron Taylor-Johnson'] },
  'the-brutalist-2024':                   { leadActors: ['Adrien Brody', 'Felicity Jones', 'Guy Pearce', 'Joe Alwyn', 'Raffey Cassidy'] },
  'we-live-in-time-2024':                 { leadActors: ['Andrew Garfield', 'Florence Pugh', 'Adam James'] },
  'blue-valentine-2010':                  { leadActors: ['Ryan Gosling', 'Michelle Williams', 'Faith Wladyka', 'John Doman'] },
  'my-own-private-idaho-1991':            { leadActors: ['River Phoenix', 'Keanu Reeves', 'James Russo', 'William Richert', 'Rodney Harvey'] },
  'rivers-edge-1986':                     { leadActors: ['Crispin Glover', 'Keanu Reeves', 'Ione Skye', 'Dennis Hopper', 'Daniel Roebuck'] },
  'american-beauty-1999':                 { leadActors: ['Kevin Spacey', 'Annette Bening', 'Thora Birch', 'Wes Bentley', 'Mena Suvari'] },
  'american-pie-1999':                    { leadActors: ['Jason Biggs', 'Alyson Hannigan', 'Chris Klein', 'Mena Suvari', 'Seann William Scott'] },

  // Albums – musician
  'kid-a-radiohead':                                  { musician: 'Radiohead' },
  'bully-kanye-west':                                 { musician: 'Kanye West' },
  'the-tortured-poets-department-taylor-swift':       { musician: 'Taylor Swift' },
  'brat-charli-xcx':                                  { musician: 'Charli XCX' },
  'eminem-the-marshall-mathers-lp':                   { musician: 'Eminem' },
  'pink-floyd-the-wall':                              { musician: 'Pink Floyd' },
  'the-beatles-the-beatles':                          { musician: 'The Beatles' },
};

const filePath = '/home/user/cultural-cartographer/src/data/artifacts.ts';
let content = readFileSync(filePath, 'utf8');

let patchedCount = 0;
let missedSlugs = [];

for (const [slug, data] of Object.entries(castData)) {
  const slugPattern = escapeRegex(slug);
  // Match from this slug entry to the pos: { line for that entry (non-greedy)
  const regex = new RegExp(`(slug: "${slugPattern}"[\\s\\S]*?)(\\n    pos: \\{)`);

  let fieldLine = '';
  if (data.leadActors) {
    fieldLine = `\n    leadActors: ${JSON.stringify(data.leadActors)},`;
  } else if (data.musician) {
    fieldLine = `\n    musician: ${JSON.stringify(data.musician)},`;
  }

  if (regex.test(content)) {
    content = content.replace(regex, `$1${fieldLine}$2`);
    patchedCount++;
  } else {
    missedSlugs.push(slug);
  }
}

writeFileSync(filePath, content, 'utf8');
console.log(`Patched ${patchedCount} entries.`);
if (missedSlugs.length > 0) {
  console.log(`Missed slugs: ${missedSlugs.join(', ')}`);
} else {
  console.log('All slugs patched successfully.');
}
