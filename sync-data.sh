#!/bin/bash
# Run this after updating /data/audit-questions.json to sync to simulator
cp data/audit-questions.json simulator/src/audit-questions.json
echo "Synced audit-questions.json to simulator/src/"
