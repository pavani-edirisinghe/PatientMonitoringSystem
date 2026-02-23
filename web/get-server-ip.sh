#!/bin/bash

# Script to find and display the server's IP address

echo "🔍 Finding your server's IP address..."
echo ""

# For Linux
if command -v ip &> /dev/null; then
    echo "📡 Available IP addresses:"
    ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v '127.0.0.1'
fi

# For Mac/BSD
if command -v ifconfig &> /dev/null; then
    echo "📡 Available IP addresses:"
    ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
fi

echo ""
echo "💡 Use one of these IP addresses in the CLIENT laptop's config.js"
echo ""
echo "Example:"
echo "export const SERVER_IP = '192.168.1.100'; // Replace with your IP"
