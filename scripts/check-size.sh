#!/bin/bash
echo "=== Taille locale ==="
du -sh .
echo "=== Taille .git ==="
du -sh .git
echo "=== Taille par dossier ==="
du -sh */ | sort -hr
echo "=== Taille images ==="
du -sh src/assets/images/ 2>/dev/null || echo "Pas de dossier src/images/"
echo "=== Taille GitHub ==="
# Détection automatique du repo
REPO=$(git remote get-url origin | sed 's/.*github\.com[:/]\([^.]*\)\.git/\1/')
curl -s https://api.github.com/repos/$REPO | grep '"size"' | head -1