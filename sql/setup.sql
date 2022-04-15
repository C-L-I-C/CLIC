-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS ascii CASCADE;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT
);

CREATE TABLE messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    message TEXT NOT NULL,
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ascii (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    string TEXT
);

INSERT INTO users (username, email)
VALUES 
('user 1', 'user1@test.com'),
('user 2', 'user2@test.com');

INSERT INTO messages (message, user_id)
VALUES 
('HELLO WORLD!', '1'),
('Goodbye, see you next time!', '2');

INSERT INTO ascii (name, string)
VALUES 
('helloworld', '
#   #        #  #          #   #   #          #     #  #
#   #        #  #          #  # #  #          #     #  #
#   #   ##   #  #   ##      # # # #   ##   ## #   ###  #
#####  #  #  #  #  #  #     # # # #  #  #  #  #  #  #  #
#   #  ####  #  #  #  # ##  # # # #  #  #  #  #  #  #  #
#   #  #     #  #  #  #     # # # #  #  #  #  #  #  #   
#   #   ###  #  #   ##       #   #    ##   #  #   ###  #
'),
('dwight', ' `/+o/.
 .+sso+/:oydyo/:-:+shdys/ `-:. `-/+o+/`
 `/sdh+/::/::ss:`ymdhyso//hmMNyhNNms+ososys+/-:/shms/`
 .+hNNy++oo+/.`.--/osyhdmNNMMMMMMMMMNdsssssoso+hhhhsoo+ymdo.
 -smNy/+ymmmmmNNNNMNMMMMMNNNmmNMMMMMMMMMho:///:--shydNMMNdo-sNs`
 -hNd+-sNMNdmNMMMNNNMNNNMMMddNMMNNmNMMMMMMNmy+///::/:-:/++ymNNdmMN:
 `sNMs`+NMNNNMMMMNNNMMMMMMNmhyso///+ohMmoNMmoo+/::/-:oymNNmsosshdhmMM/
 +NMMy`hMMMhyNMNMMNNNMds:-.`-:syddmNMMmyo`+yMMho:..-+//++omMNNNNNNNmdNMs
 :mMMMh`yMNdodNNNMNMMMs.+sdmmmmmdhNMMMNhy/..`-syhNmdyssso+/.`:yNMMMMNMNMMMy
 :NMNh:-+MMh+mdNNNNNMd.+NNMMMMMMMMmho:-......:--::ohNMMMMMMNmNy/.oNMNmNMNMMMs
 :NMm+/dmmMNydyhNdhMMN.yMMNmhysso+:-`` ```.--:/+sdMMMMMNNNm:-mMNNNNMMMMy
 :NMy/hNMMMMmNddsh/NmMy-Mms:..`.--.` ``..-.:yNMMMMNMNs:NMMMNNNNMMy
 :NNy/mMMMMMMmNMMshsNdMo/d-...`` ```...-yMMMNNMd`NMMNMdmoNMM-
 /mMm+NMNNMMNMNNNNNNNNMMmom/ ```..`+NMMMMh`NMMMMNNdhNMh
 +NMMmmMNyNMNMMMMMNmmmNMdNNyh+. ``````/NMMM::MMMMNMNNmNMN
 +MNNMMMNymMNNMMMNNNNNMh+:+dNmddhyoo+` ````.`sMMN`sMNNMNNMNNNNN
 dNNNMNNddMNNNNNNmymMN+---::/shdhyyy: `````..hMo.NMNMNMMMNmMMd
 dNNNMMNmNNNmmNMNdNMM+.-..----.-:::. ````...:mh/NMMMNMMMNNMMh
 sMNNMMNMNNmyNMNdmNMo--..... ``...---:dNMNMMNMMNNNMMN.
 :NNNMMMNNNsmMNmMNMy...`.-.` `.-----:odNmmNMMMMMNMMo
 .NMMMmMMMNmMNNNNMm:-.```.. ``-----:/o//dMMMNMMMm
 .NMMMNMMNMMNMNNNNs--.``... `....---..dMNMMMMM`
 .NNMMNNNNNMMMNNNN:-...`... ```.....`+MMMMMMM.
 .MNNNNNNNMMMMMNNy.......-.` ``..---.`.NMMMMMM`
 `NMNMMNNNMMNMMMm-...`.-----.` ``.-----.`yMMMMMd
 dMMMNNNNMMNNMMo`-....----..` `` `.`` ```.------`:MMMMM-
 /MMNMNNNMMNMMN-`.`..-.--.` `--..-:-.-.``..`` ```.-......--.----..NMMMd
 `mMNMNNMMMNNMN.``...-.-../hddyysyhysyyso+--/::-..--...----:::+syyyyhhdddy+:-.-.hMMM:
 :NNNNNNMMMMMN.`....--.:dy/:-.-/+++ososss+/:+shyo/::/:+os+:+syosyoso+/://ss//.`+MMm
 +MdmNNMNMMMN+.--....:+-.-:+ooymdddmdhyo++ss+/yMo.`..oNsyhdhmdmmmmNmdo:-.--:+-:MM/
 `y/..-+dNNMMMo-shhyo++--+sso-`dsymoso.smyso+//.od+/:/ho+yyhd/ymsNhyy./yy/``.-hhmm`
 .s+md+- oMMMm``.-/sy//-.+/s. odys+s- /shyso+.sm+:::yd/hh+:`.hyyhy- `/y/.` `hs/s`
 -oyMNyhs:NMMo `.-` .---` ``.`/::+s/ms````-mo+:`````.--` ```` `sNm`
 `hsMh`.hymMM: `- ` .:+:hy` od:-` .+sM-``
 o+o/``-/mMM- .- ``.```hy` s.`.` -/+M+``
 .s `./NMMMM- -- ```` `:ho` .s` ``` ./.+My`
 /: `+MMdMM/ -. ` ` ..+++- :d/. ``:o-`oMy
 o. .sdNMMm` `--:://+//.`-///:. `.ohooo:-.`` `.-:+//:..`hMy
 `s```.yMMMs ``` .y+ `::.:----.-``o:-::/:::--:::-----..mMo
 :s` `oMNMN- :N+ -NNhy/:/sds./:..----------------`/MN.
 +o``-NMNMd` `-syyoo++/.++:so/+yN+..--....-..-....--`dM+
 +:.`oMNNN` .:-` `.::.` `--..---/+/---.```........-.:d:
 ./++Ny::` `--` .--..-----::-..```......---.s.
 `:os.--` .` `.. ``.------.`.```..-----.:o
 `h-..` `` .:syy/-/ydho-.--...`````.------.+.
 +o`.` ./ymNNNNNNNmmNNNh:....``.```.-----:s
 `h-`. -/+oyo/:----:---.--:+sso:........--::-+:
 /d... `.++: -:--/+:/oo+o++-.``--.....-----:-:y
 `Md:.` `` `-:/+ooooo+/-........-----------yo
 mNNs-` `..-/oo+://:/oo:......----------os
 h:+md:. ...``.` `------.---------++
 `h..-+ddo.` ``.----------------s:
 h` .--/ydy:` `...--------------------+y.
 h` ..--+yds+.` `....----------------:+dN`
 `y `.-.-:sdhs:.` `...````..----------------:smsdm
 `h .--..-+ymdy+/:----:----------------.-/shs+.`os
 `h `..--..:sdmmhyo/::----------::/+syhy/....`+-
 -y `..--..--/oosyyyhhhyyyssoooo/:.`...`.` /-
 `. `..--.......................```` +`
 `...------..-.........``
 ``..-.--........``
 ```..```');
