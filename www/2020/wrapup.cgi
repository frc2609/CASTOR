#!/usr/bin/perl -w

use strict;
use warnings;
use CGI;
use lib '../../pm';
use webutil;

my $cgi = CGI->new;
my $webutil = webutil->new;

my $game = $cgi->param('game')||'';
$webutil->error("Bad game parameter", $game) if ($game !~ /^2020[0-9a-zA-Z\-]+_(qm|qf|sm|f)[0-9]+_[RB][1-3]$/);
my $team = $cgi->param('team')||"";
$webutil->error("Bad team parameter", $team) if ($team !~ /^[0-9]+$/);
my $auto = $cgi->param('auto')||"0-0-0-0";
$webutil->error("Bad auto parameter", $auto) if ($auto !~ /^([0-9]+-){3}[0-9]+$/);
my $teleop = $cgi->param('teleop')||"0-0-0";
$webutil->error("Bad teleop parameter", $teleop) if ($teleop !~ /^([0-9]+-){2}[0-9]+$/);
my $missed = $cgi->param('missed')||"0-0";
$webutil->error("Bad missed parameter", $missed) if ($missed !~ /^[0-9]+-[0-9]+$/);
my $shotloc = $cgi->param('shotloc')||"000000000000000000000000000000";
$webutil->error("Bad shotloc parameter", $shotloc) if ($shotloc !~ /^[01]{30}$/);
my $ctrl = $cgi->param('ctrl')||"00";
$webutil->error("Bad ctrl parameter", $ctrl) if ($ctrl !~ /^[01]{2}$/);

# print web page beginning
print "Content-type: text/html; charset=UTF-8\n\n";
print "<html>\n";
print "<head>\n";
print "<title>FRC 1073 Scouting App</title>\n";
print "</head>\n";
print "<body><center>\n";

# declare the form
print "<form action=\"score.cgi\" id=\"wrapup\" enctype=\"text/plain\">\n";
print "<input type=\"hidden\" name=\"game\" value=\"$game\">\n";
print "<input type=\"hidden\" name=\"team\" value=\"$team\">\n";
print "<input type=\"hidden\" name=\"auto\" value=\"$auto\">\n";
print "<input type=\"hidden\" name=\"teleop\" value=\"$teleop\">\n";
print "<input type=\"hidden\" name=\"missed\" value=\"$missed\">\n";
print "<input type=\"hidden\" name=\"shotloc\" value=\"$shotloc\">\n";
print "<input type=\"hidden\" name=\"ctrl\" value=\"$ctrl\">\n";

print "<h2>End Game</h2>\n";

print "<table border=0 cellpadding=5 cellspacing=0>\n";
print "<tr><td align=left><p style=\"font-size:20px;\">$team parked under shield?</p></td>\n";
print "<td><input type=\"radio\" name=\"park\" value=\"1\">Yes</td>\n";
print "<td><input type=\"radio\" name=\"park\" value=\"0\" CHECKED>No</td>";
print "<tr><td align=left><p style=\"font-size:20px;\">$team climbed without help?</p></td>\n";
print "<td><input type=\"radio\" name=\"climb\" value=\"1\">Yes</td>\n";
print "<td><input type=\"radio\" name=\"climb\" value=\"0\" CHECKED>No</td>";
print "<td colspan=2>&nbsp;</td></tr>\n";
print "<tr><td align=left><p style=\"font-size:20px;\">$team climbed when bar was:</p></td>\n";
print "<td><input type=\"radio\" name=\"bar\" value=\"3\">High</td>\n";
print "<td><input type=\"radio\" name=\"bar\" value=\"2\">Level</td>\n";
print "<td><input type=\"radio\" name=\"bar\" value=\"1\">Low</td>\n";
print "<td><input type=\"radio\" name=\"bar\" value=\"0\" CHECKED>N/A</td>\n";
print "<tr><td align=left><p style=\"font-size:20px;\">$team lifted others?</p></td>\n";
print "<td><input type=\"radio\" name=\"buddy\" value=\"1\">Yes</td>\n";
print "<td><input type=\"radio\" name=\"buddy\" value=\"0\" CHECKED>No</td>\n";
print "<td colspan=2>&nbsp;</td></tr>\n";
print "<tr><td align=left><p style=\"font-size:20px;\">$team controlled leveling?</p></td>\n";
print "<td><input type=\"radio\" name=\"level\" value=\"1\">Yes</td>\n";
print "<td><input type=\"radio\" name=\"level\" value=\"0\" CHECKED>No</td>\n";
print "<td colspan=2>&nbsp;</td></tr>\n";

print "</table><hr>\n";


print "<table border=0 cellpadding=5 cellspacing=0>\n";
print "<tr><th colspan=3><p style=\"font-size:25px;\">Did $team play defense?</p></th></tr>\n";
print "<tr><td><input type=\"radio\" name=\"defense\" value=\"3\"></td>\n";
print "<td><p style=\"font-size:20px;\">Good defense</p></td>\n";
print "<td><p>not many game pieces scored by opponent during defense</p></td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"defense\" value=\"2\"></td>\n";
print "<td><p style=\"font-size:20px;\">Average defense</p></td>\n";
print "<td><p>opponent was still able to score some game pieces</p></td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"defense\" value=\"1\"></td>\n";
print "<td><p style=\"font-size:20px;\">Below average defense</p></td>\n";
print "<td><p>opponent was still able to score game pieces</p></td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"defense\" value=\"0\" CHECKED></td>\n";
print "<td><p style=\"font-size:20px;\">No defense played</p></td><td>&nbsp;</td></tr>\n";
print "</table><hr>\n";

print "<table border=0 cellpadding=5 cellspacing=0>\n";
print "<tr><th colspan=3><p style=\"font-size:25px;\">Was $team defended?</p></th></tr>\n";
print "<tr><td><input type=\"radio\" name=\"defended\" value=\"3\"></td>\n";
print "<td><p style=\"font-size:20px;\">Good against defense</p></td>\n";
print "<td><p>defended but still scored game pieces</p></td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"defended\" value=\"2\"></td>\n";
print "<td><p style=\"font-size:20px\">Average against defense</p></td>\n";
print "<td><p>defended but still able to score some game pieces</p></td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"defended\" value=\"1\"></td>\n";
print "<td><p style=\"font-size:20px;\">Affected by defense</p></td>\n";
print "<td><p>good defense really affected robot performance</p></td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"defended\" value=\"0\" CHECKED></td>\n";
print "<td><p style=\"font-size:20px;\">Not defended</p></td><td>&nbsp;</td></tr>\n";
print "</table><hr>\n";

print "<table border=0 cellpadding=5 cellspacing=0>\n";
print "<tr><th><h2>Did $team receive any fouls?</h2></th>";
print "<th><h2>Did $team receive any tech fouls?</h2></th></tr>\n";
print "<tr><td><input type=\"radio\" name=\"fouls\" value=\"3\"><b>Many fouls</b></td>\n";
print "<td><input type=\"radio\" name=\"techfouls\" value=\"3\"><b>Many tech fouls</b></td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"fouls\" value=\"2\"><b>A few fouls</b></td>\n";
print "<td><input type=\"radio\" name=\"techfouls\" value=\"2\"><b>A few tech fouls</b></td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"fouls\" value=\"1\"><b>One foul</b></td>\n";
print "<td><input type=\"radio\" name=\"techfouls\" value=\"1\"><b>One tech foul</b></td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"fouls\" value=\"0\" CHECKED><b>No fouls</b></td>\n";
print "<td><input type=\"radio\" name=\"techfouls\" value=\"0\" CHECKED><b>No tech fouls</b></td></tr>\n";
print "</table><hr>\n";

print "<table border=0 cellpadding=5 cellspacing=0>\n";
print "<tr><th colspan=3><p style=\"font-size:25px;\">Is $team a good robot?</p></th></tr>\n";
print "<tr><td><input type=\"radio\" name=\"rank\" value=\"3\"></td>";
print "<td><p style=\"font-size:20px;\">Very good robot</p></td>";
print "<td>could be an alliance captain</td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"rank\" value=\"2\"></td>";
print "<td><p style=\"font-size:20px;\">Decent robot</p></td>";
print "<td>a productive robot</td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"rank\" value=\"1\"></td>";
print "<td><p style=\"font-size:20px;\">Struggled to be effective</p></td>";
print "<td>maybe good at one thing, but bad at others</td></tr>\n";
print "<tr><td><input type=\"radio\" name=\"rank\" value=\"0\" CHECKED></td>";
print "<td><p style=\"font-size:20px;\">Unknown</p></td>";
print "<td>robot was disabled, did not participate, etc.</td></tr>\n";
print "</table><hr>\n";

print "<h2>Scouter Name: <input type=\"text\" name=\"scouter\"></h2>\n";

print "<h2>Comments: <textarea name=\"comments\" form=\"wrapup\" cols=\"50\" rows=\"5\"></textarea></h2>\n";

print "<input type=\"submit\" value=\"Save answers\">";

print "</body></html>\n";
