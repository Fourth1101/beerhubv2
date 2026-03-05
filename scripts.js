      let editMode = false;
        let currentNotepadIndex = 1;
        let notepads = {
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',
            7: ''
        };
        
        // Load notepads from localStorage on startup
        function loadNotepads() {
            const saved = localStorage.getItem('notepads');
            if (saved) {
                notepads = JSON.parse(saved);
            }
        }
        
        // Save notepads to localStorage
        function saveAllNotepads() {
            localStorage.setItem('notepads', JSON.stringify(notepads));
        }
        
        function selectWinner(teamElement) {
            if (editMode) return;
            
            const match = teamElement.parentElement;
            const teams = match.querySelectorAll('.team');
            const round = parseInt(match.dataset.round);
            const matchNum = parseInt(match.dataset.match);
            
            // Clear previous selections in this match
            teams.forEach(team => {
                team.classList.remove('winner', 'loser');
            });
            
            // Mark winner and loser
            teamElement.classList.add('winner');
            teams.forEach(team => {
                if (team !== teamElement) {
                    team.classList.add('loser');
                }
            });
            
            // Advance winner to next round
            advanceWinner(teamElement, round, matchNum);
        }
        
        function advanceWinner(winnerElement, currentRound, currentMatch) {
            const teamName = winnerElement.querySelector('.team-name').textContent;
            const teamScore = winnerElement.querySelector('.team-score').textContent;
            
            if (currentRound === 1) {
                // Advance to semifinals
                const semiMatch = Math.ceil(currentMatch / 2);
                const semiTeam = (currentMatch % 2 === 1) ? 1 : 2;
                const targetTeam = document.querySelector(`[data-round="2"][data-match="${semiMatch}"] .team:nth-child(${semiTeam})`);
                targetTeam.querySelector('.team-name').textContent = teamName;
                targetTeam.querySelector('.team-score').textContent = teamScore;
            } else if (currentRound === 2) {
                // Advance to finals
                const finalTeam = currentMatch;
                const targetTeam = document.querySelector(`[data-round="3"][data-match="1"] .team:nth-child(${finalTeam})`);
                targetTeam.querySelector('.team-name').textContent = teamName;
                targetTeam.querySelector('.team-score').textContent = teamScore;
            } else if (currentRound === 3) {
                // Advance to champion
                const championTeam = document.querySelector(`[data-round="4"][data-match="1"] .team`);
                championTeam.querySelector('.team-name').textContent = teamName;
                championTeam.querySelector('.team-score').textContent = '👑';
                championTeam.style.background = 'linear-gradient(135deg, #f6ad55, #ed8936)';
                championTeam.style.color = 'white';
                
                // Celebration effect
                setTimeout(() => {
                    alert(`Yay ${teamName} is winner! 🏆`);
                }, 500);
            }
        }
        
        function toggleEditMode() {
            editMode = !editMode;
            const button = event.target;
            
            if (editMode) {
                button.textContent = '💾 Save';
                button.title = 'Save Changes';
                button.style.background = '#ed8936';
                enableEditing();
            } else {
                button.textContent = 'Rename';
                button.title = 'Edit Teams';
                button.style.background = '#667eea';
                disableEditing();
            }
        }
        
        function enableEditing() {
            const teams = document.querySelectorAll('[data-round="1"] .team');
            teams.forEach(team => {
                const nameSpan = team.querySelector('.team-name');
                const scoreSpan = team.querySelector('.team-score');
                
                const nameInput = document.createElement('input');
                nameInput.className = 'team-input';
                nameInput.value = nameSpan.textContent;
                nameInput.addEventListener('blur', () => {
                    nameSpan.textContent = nameInput.value || 'Team Name';
                });
                
                const scoreInput = document.createElement('input');
                scoreInput.className = 'score-input';
                scoreInput.type = 'number';
                scoreInput.value = scoreSpan.textContent;
                scoreInput.addEventListener('blur', () => {
                    scoreSpan.textContent = scoreInput.value || '0';
                });
                
                nameSpan.style.display = 'none';
                scoreSpan.style.display = 'none';
                team.appendChild(nameInput);
                team.appendChild(scoreInput);
                team.classList.add('edit-mode');
            });
        }
        
        function disableEditing() {
            const teams = document.querySelectorAll('[data-round="1"] .team');
            teams.forEach(team => {
                const inputs = team.querySelectorAll('input');
                inputs.forEach(input => input.remove());
                
                const nameSpan = team.querySelector('.team-name');
                const scoreSpan = team.querySelector('.team-score');
                nameSpan.style.display = 'block';
                scoreSpan.style.display = 'block';
                team.classList.remove('edit-mode');
            });
        }
        
        function resetBracket() {
            // Reset all teams except Round 1
            const teamsToReset = document.querySelectorAll('[data-round]:not([data-round="1"]) .team-name');
            teamsToReset.forEach(team => {
                team.textContent = '???';
            });
            
            // Reset all scores to 0
            const scoresToReset = document.querySelectorAll('.team-score');
            scoresToReset.forEach((score, index) => {
                if (score.textContent !== '👑') {
                    score.textContent = '0';
                }
            });
            
            // Remove winner/loser classes
            const allTeams = document.querySelectorAll('.team');
            allTeams.forEach(team => {
                team.classList.remove('winner', 'loser');
                team.style.background = '';
                team.style.color = '';
            });
            
            // Reset champion
            const champion = document.querySelector('[data-team="champion"]');
            champion.querySelector('.team-name').textContent = '???';
            champion.style.background = '';
            champion.style.color = '';
        }

        document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});
        
        function randomizeBracket() {
            const matches = document.querySelectorAll('[data-round="1"] .match');
            matches.forEach(match => {
                const teams = match.querySelectorAll('.team');
                const randomWinner = teams[Math.floor(Math.random() * teams.length)];
                
                // Add random scores
                teams.forEach(team => {
                    const score = Math.floor(Math.random() * 100) + 50;
                    team.querySelector('.team-score').textContent = score;
                });
                
                selectWinner(randomWinner);
            });
            
            // Continue with semifinals
            setTimeout(() => {
                const semiMatches = document.querySelectorAll('[data-round="2"] .match');
                semiMatches.forEach(match => {
                    const teams = match.querySelectorAll('.team');
                    if (teams[0].querySelector('.team-name').textContent !== '???') {
                        const randomWinner = teams[Math.floor(Math.random() * teams.length)];
                        selectWinner(randomWinner);
                    }
                });
                
                // Continue with finals
                setTimeout(() => {
                    const finalMatch = document.querySelector('[data-round="3"] .match');
                    const finalTeams = finalMatch.querySelectorAll('.team');
                    if (finalTeams[0].querySelector('.team-name').textContent !== '???') {
                        const randomWinner = finalTeams[Math.floor(Math.random() * finalTeams.length)];
                        selectWinner(randomWinner);
                    }
                }, 1000);
            }, 1000);
        }
        
        function toggleInfo() {
            const infoMenu = document.getElementById('infoMenu');
            infoMenu.classList.toggle('active');
        }
        
        function toggleLinks() {
            const linksMenu = document.getElementById('linksMenu');
            linksMenu.classList.toggle('active');
        }
        
        function toggleNotepad() {
            const notepadMenu = document.getElementById('notepadMenu');
            notepadMenu.classList.toggle('active');
            
            // Load current notepad content
            const textarea = document.getElementById('notepadText');
            textarea.value = notepads[currentNotepadIndex];
        }
        
        function switchNotepad(index) {
            // Save current notepad before switching
            notepads[currentNotepadIndex] = document.getElementById('notepadText').value;
            saveAllNotepads();
            
            // Switch to new notepad
            currentNotepadIndex = index;
            const textarea = document.getElementById('notepadText');
            textarea.value = notepads[index];
            
            // Update tab styling
            document.querySelectorAll('.notepad-tab').forEach((tab, idx) => {
                tab.classList.toggle('active', idx + 1 === index);
            });
        }
        
        function saveNotepad() {
            notepads[currentNotepadIndex] = document.getElementById('notepadText').value;
            saveAllNotepads();
            
            // Show brief feedback
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = 'Saved ✓';
            btn.style.background = '#38a169';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 1500);
        }
        
        // Close menus when clicking outside (but not notepad menu)
        document.addEventListener('click', function(event) {
            const infoMenu = document.getElementById('infoMenu');
            const linksMenu = document.getElementById('linksMenu');
            const infoButton = event.target.closest('button[onclick="toggleInfo()"]');
            const linksButton = event.target.closest('button[onclick="toggleLinks()"]');
            
            if (!infoButton && !infoMenu.contains(event.target)) {
                infoMenu.classList.remove('active');
            }
            
            if (!linksButton && !linksMenu.contains(event.target)) {
                linksMenu.classList.remove('active');
            }
        });
        
        // Load notepads on page load
        window.addEventListener('DOMContentLoaded', loadNotepads);