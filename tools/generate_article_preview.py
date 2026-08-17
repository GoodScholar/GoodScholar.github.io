#!/usr/bin/env python3

import sys
import os
import markdown
from pathlib import Path

def generate_html(input_file, platform):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            content = parts[2].lstrip()
    
    md = markdown.Markdown(extensions=['fenced_code', 'tables', 'toc'])
    html_content = md.convert(content)
    
    title = input_file.split('/')[-1].replace('.md', '').replace('-', ' ')
    
    if platform == 'wechat':
        css = """
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');
        
        :root {
            --primary-gradient: linear-gradient(135deg, #07c160 0%, #10b981 50%, #059669 100%);
            --secondary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --bg-gradient: linear-gradient(180deg, #f0fdf4 0%, #fafafa 100%);
            --card-bg: rgba(255, 255, 255, 0.95);
            --text-primary: #1f2937;
            --text-secondary: #4b5563;
            --text-muted: #9ca3af;
            --border-color: rgba(229, 231, 235, 0.8);
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
            --shadow-md: 0 10px 30px rgba(7, 193, 96, 0.15);
            --shadow-lg: 0 20px 40px rgba(7, 193, 96, 0.2);
            --radius-sm: 10px;
            --radius-md: 16px;
            --radius-lg: 24px;
            --accent-color: #07c160;
            --accent-hover: #06ad56;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
            max-width: 720px;
            margin: 0 auto;
            padding: 0;
            line-height: 1.85;
            color: var(--text-primary);
            background: var(--bg-gradient);
            min-height: 100vh;
        }
        
        .article-header {
            background: var(--primary-gradient);
            padding: 48px 32px 56px;
            border-radius: 0 0 var(--radius-lg) var(--radius-lg);
            position: relative;
            overflow: hidden;
        }
        
        .article-header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 300px;
            height: 300px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            filter: blur(60px);
        }
        
        .article-header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -10%;
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.08);
            border-radius: 50%;
            filter: blur(40px);
        }
        
        h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 16px;
            text-align: center;
            line-height: 1.45;
            color: white;
            position: relative;
            z-index: 1;
            letter-spacing: -0.5px;
        }
        
        .meta-bar {
            display: flex;
            justify-content: center;
            gap: 20px;
            position: relative;
            z-index: 1;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
            color: rgba(255,255,255,0.85);
            font-size: 13px;
        }
        
        .meta-item svg { width: 16px; height: 16px; }
        
        .article-container {
            background: var(--card-bg);
            margin: -28px 16px 32px;
            padding: 36px 28px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-md);
            position: relative;
            z-index: 2;
        }
        
        h2 {
            font-size: 20px;
            font-weight: 600;
            margin: 36px 0 18px;
            padding-bottom: 14px;
            position: relative;
            color: var(--text-primary);
        }
        
        h2::before {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 48px;
            height: 4px;
            background: var(--primary-gradient);
            border-radius: 2px;
        }
        
        h2::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            background: var(--border-color);
        }
        
        h3 {
            font-size: 17px;
            font-weight: 600;
            margin: 28px 0 14px;
            color: var(--text-primary);
            padding-left: 14px;
            border-left: 3px solid var(--accent-color);
        }
        
        p {
            margin: 16px 0;
            font-size: 15px;
            color: var(--text-secondary);
            text-align: justify;
            text-indent: 2em;
        }
        
        ul, ol {
            padding-left: 32px;
            margin: 18px 0;
        }
        
        li {
            margin: 12px 0;
            font-size: 15px;
            color: var(--text-secondary);
            position: relative;
        }
        
        li::marker {
            color: var(--accent-color);
            font-weight: bold;
            font-size: 14px;
        }
        
        li::before {
            content: '';
            position: absolute;
            left: -20px;
            top: 10px;
            width: 6px;
            height: 6px;
            background: var(--accent-color);
            border-radius: 50%;
        }
        
        code {
            background: rgba(7, 193, 96, 0.08);
            padding: 4px 10px;
            border-radius: 8px;
            font-family: "SF Mono", Monaco, "Courier New", monospace;
            font-size: 14px;
            color: #06ad56;
            font-weight: 500;
        }
        
        pre {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            padding: 24px;
            border-radius: var(--radius-md);
            overflow-x: auto;
            margin: 20px 0;
            position: relative;
            border: 1px solid rgba(255,255,255,0.08);
        }
        
        pre::before {
            content: '';
            position: absolute;
            top: 14px;
            left: 14px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ff5f56;
            box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
        }
        
        pre code {
            background: none;
            padding: 0;
            font-size: 13px;
            line-height: 1.8;
            color: #e2e8f0;
            font-weight: normal;
        }
        
        blockquote {
            background: linear-gradient(135deg, rgba(7, 193, 96, 0.06) 0%, rgba(16, 185, 129, 0.04) 100%);
            padding: 20px 24px;
            margin: 24px 0;
            border-left: 4px solid var(--accent-color);
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            position: relative;
        }
        
        blockquote::before {
            content: '“';
            position: absolute;
            top: -8px;
            left: 12px;
            font-size: 48px;
            color: rgba(7, 193, 96, 0.15);
            font-family: Georgia, serif;
        }
        
        blockquote p {
            color: var(--text-secondary);
            font-style: italic;
            margin: 0;
            text-indent: 0;
            position: relative;
            z-index: 1;
        }
        
        img {
            max-width: 100%;
            border-radius: var(--radius-md);
            margin: 20px 0;
            display: block;
            margin-left: auto;
            margin-right: auto;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            background: var(--bg-gradient);
            border-radius: var(--radius-md);
            overflow: hidden;
            border: 1px solid var(--border-color);
        }
        
        th {
            background: var(--primary-gradient);
            color: white;
            padding: 14px 18px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            white-space: nowrap;
        }
        
        td {
            padding: 14px 18px;
            border-bottom: 1px solid var(--border-color);
            font-size: 14.5px;
            color: var(--text-secondary);
            transition: background 0.2s;
        }
        
        tr:last-child td { border-bottom: none; }
        
        tr:hover td { background: rgba(7, 193, 96, 0.05); }
        
        a {
            color: var(--accent-color);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
            border-bottom: 1.5px solid transparent;
        }
        
        a:hover {
            border-bottom-color: var(--accent-color);
            color: var(--accent-hover);
        }
        
        .highlight {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border-left: 4px solid #f59e0b;
            padding: 16px 20px;
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            margin: 16px 0;
        }
        
        .warning-box {
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(234, 88, 12, 0.06) 100%);
            border-left: 4px solid #f97316;
            padding: 20px;
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            margin: 20px 0;
        }
        
        .tip-box {
            background: linear-gradient(135deg, rgba(7, 193, 96, 0.08) 0%, rgba(16, 185, 129, 0.06) 100%);
            border-left: 4px solid var(--accent-color);
            padding: 20px;
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            margin: 20px 0;
        }
        
        .copy-btn {
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 12px 26px;
            background: rgba(255,255,255,0.95);
            color: var(--accent-color);
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(10px);
        }
        
        .copy-btn:hover {
            background: white;
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(7, 193, 96, 0.25);
        }
        
        .copy-btn:active { transform: translateY(-1px); }
        
        .copy-btn svg { width: 18px; height: 18px; }
        
        .copy-success {
            position: fixed;
            top: 80px;
            right: 24px;
            padding: 12px 28px;
            background: rgba(7, 193, 96, 0.95);
            color: white;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            z-index: 1000;
            display: none;
            animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 16px rgba(7, 193, 96, 0.4);
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .tags-section {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px dashed var(--border-color);
        }
        
        .tag {
            padding: 6px 16px;
            background: rgba(7, 193, 96, 0.08);
            color: var(--accent-color);
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        .tag:hover {
            background: rgba(7, 193, 96, 0.15);
            transform: scale(1.05);
        }
        
        hr {
            border: none;
            height: 1px;
            background: var(--border-color);
            margin: 28px 0;
        }
        
        .article-footer {
            text-align: center;
            padding: 24px;
            color: var(--text-muted);
            font-size: 13px;
        }
        
        @media (max-width: 768px) {
            .article-header { padding: 36px 20px 44px; }
            h1 { font-size: 24px; }
            .article-container { margin: -24px 12px 24px; padding: 28px 20px; }
            h2 { font-size: 18px; }
            h3 { font-size: 16px; }
            .copy-btn { padding: 10px 20px; font-size: 13px; }
        }
        </style>
        """
    else:
        css = """
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap');
        
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --bg-gradient: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
            --card-bg: rgba(255, 255, 255, 0.98);
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-muted: #94a3b8;
            --border-color: rgba(226, 232, 240, 0.8);
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
            --shadow-md: 0 12px 40px rgba(102, 126, 234, 0.15);
            --shadow-lg: 0 24px 60px rgba(102, 126, 234, 0.2);
            --radius-sm: 12px;
            --radius-md: 20px;
            --radius-lg: 32px;
            --accent-color: #667eea;
            --accent-hover: #5a6fd6;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
            max-width: 920px;
            margin: 0 auto;
            padding: 0;
            line-height: 1.9;
            color: var(--text-primary);
            background: var(--bg-gradient);
            min-height: 100vh;
        }
        
        .article-header {
            background: var(--primary-gradient);
            padding: 64px 40px 72px;
            border-radius: 0 0 var(--radius-lg) var(--radius-lg);
            position: relative;
            overflow: hidden;
            text-align: center;
        }
        
        .article-header::before {
            content: '';
            position: absolute;
            top: -40%;
            right: -10%;
            width: 400px;
            height: 400px;
            background: rgba(255,255,255,0.12);
            border-radius: 50%;
            filter: blur(80px);
        }
        
        .article-header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -15%;
            width: 280px;
            height: 280px;
            background: rgba(255,255,255,0.08);
            border-radius: 50%;
            filter: blur(50px);
        }
        
        .header-decoration {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            transform: rotate(15deg);
        }
        
        h1 {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 20px;
            line-height: 1.4;
            color: white;
            position: relative;
            z-index: 1;
            letter-spacing: -0.8px;
        }
        
        .meta-bar {
            display: flex;
            justify-content: center;
            gap: 28px;
            position: relative;
            z-index: 1;
            flex-wrap: wrap;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: rgba(255,255,255,0.88);
            font-size: 14px;
            font-weight: 500;
        }
        
        .meta-item svg { width: 18px; height: 18px; }
        
        .article-container {
            background: var(--card-bg);
            margin: -36px 20px 40px;
            padding: 48px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            position: relative;
            z-index: 2;
        }
        
        h2 {
            font-size: 24px;
            font-weight: 600;
            margin: 44px 0 20px;
            padding-bottom: 16px;
            position: relative;
            color: var(--text-primary);
        }
        
        h2::before {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 56px;
            height: 4px;
            background: var(--primary-gradient);
            border-radius: 2px;
        }
        
        h2::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            background: var(--border-color);
        }
        
        h3 {
            font-size: 19px;
            font-weight: 600;
            margin: 32px 0 16px;
            color: var(--text-primary);
            padding-left: 18px;
            border-left: 4px solid var(--accent-color);
        }
        
        p {
            margin: 18px 0;
            font-size: 16px;
            color: var(--text-secondary);
            text-align: justify;
            text-indent: 2em;
        }
        
        ul, ol {
            padding-left: 40px;
            margin: 20px 0;
        }
        
        li {
            margin: 14px 0;
            font-size: 16px;
            color: var(--text-secondary);
            position: relative;
        }
        
        li::marker {
            color: var(--accent-color);
            font-weight: bold;
            font-size: 15px;
        }
        
        code {
            background: rgba(102, 126, 234, 0.08);
            padding: 5px 12px;
            border-radius: 10px;
            font-family: 'Fira Code', "SF Mono", Monaco, monospace;
            font-size: 14px;
            color: #5a6fd6;
            font-weight: 500;
        }
        
        pre {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
            padding: 28px;
            border-radius: var(--radius-md);
            overflow-x: auto;
            margin: 24px 0;
            position: relative;
            border: 1px solid rgba(255,255,255,0.06);
        }
        
        pre::before {
            content: '';
            position: absolute;
            top: 16px;
            left: 16px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #ff5f56;
            box-shadow: 24px 0 0 #ffbd2e, 48px 0 0 #27c93f;
        }
        
        pre code {
            background: none;
            padding: 0;
            font-size: 14px;
            line-height: 1.9;
            color: #e2e8f0;
            font-weight: normal;
        }
        
        blockquote {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(118, 75, 162, 0.04) 100%);
            padding: 24px 30px;
            margin: 28px 0;
            border-left: 4px solid var(--accent-color);
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            position: relative;
        }
        
        blockquote::before {
            content: '“';
            position: absolute;
            top: -12px;
            left: 16px;
            font-size: 56px;
            color: rgba(102, 126, 234, 0.15);
            font-family: Georgia, serif;
        }
        
        blockquote p {
            color: var(--text-secondary);
            font-style: italic;
            margin: 0;
            text-indent: 0;
            position: relative;
            z-index: 1;
            font-size: 16.5px;
        }
        
        img {
            max-width: 100%;
            border-radius: var(--radius-md);
            margin: 24px 0;
            display: block;
            margin-left: auto;
            margin-right: auto;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 28px 0;
            background: var(--bg-gradient);
            border-radius: var(--radius-md);
            overflow: hidden;
            border: 1px solid var(--border-color);
        }
        
        th {
            background: var(--primary-gradient);
            color: white;
            padding: 16px 20px;
            text-align: left;
            font-weight: 600;
            font-size: 14.5px;
            white-space: nowrap;
        }
        
        td {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color);
            font-size: 15px;
            color: var(--text-secondary);
            transition: background 0.2s;
        }
        
        tr:last-child td { border-bottom: none; }
        
        tr:hover td { background: rgba(102, 126, 234, 0.05); }
        
        a {
            color: var(--accent-color);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
            border-bottom: 2px solid transparent;
        }
        
        a:hover {
            border-bottom-color: var(--accent-color);
            color: var(--accent-hover);
        }
        
        .highlight {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border-left: 4px solid #f59e0b;
            padding: 18px 24px;
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            margin: 18px 0;
        }
        
        .warning-box {
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(234, 88, 12, 0.06) 100%);
            border-left: 4px solid #f97316;
            padding: 22px;
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            margin: 24px 0;
        }
        
        .tip-box {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.06) 100%);
            border-left: 4px solid var(--accent-color);
            padding: 22px;
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            margin: 24px 0;
        }
        
        .copy-btn {
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 14px 32px;
            background: rgba(255,255,255,0.95);
            color: var(--accent-color);
            border: none;
            border-radius: 28px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 6px 24px rgba(0,0,0,0.15);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 10px;
            backdrop-filter: blur(12px);
        }
        
        .copy-btn:hover {
            background: white;
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3);
        }
        
        .copy-btn:active { transform: translateY(-2px); }
        
        .copy-btn svg { width: 20px; height: 20px; }
        
        .copy-success {
            position: fixed;
            top: 84px;
            right: 24px;
            padding: 14px 32px;
            background: rgba(7, 193, 96, 0.95);
            color: white;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 600;
            z-index: 1000;
            display: none;
            animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 6px 20px rgba(7, 193, 96, 0.4);
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .tags-section {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            margin-top: 40px;
            padding-top: 32px;
            border-top: 1px dashed var(--border-color);
        }
        
        .tag {
            padding: 8px 20px;
            background: rgba(102, 126, 234, 0.08);
            color: var(--accent-color);
            border-radius: 24px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            border: 1px solid rgba(102, 126, 234, 0.15);
        }
        
        .tag:hover {
            background: rgba(102, 126, 234, 0.15);
            transform: scale(1.05);
            border-color: rgba(102, 126, 234, 0.3);
        }
        
        hr {
            border: none;
            height: 1px;
            background: var(--border-color);
            margin: 32px 0;
        }
        
        .article-footer {
            text-align: center;
            padding: 32px;
            color: var(--text-muted);
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .article-header { padding: 48px 24px 56px; }
            h1 { font-size: 28px; }
            .article-container { margin: -32px 12px 28px; padding: 32px 24px; }
            h2 { font-size: 22px; }
            h3 { font-size: 18px; }
            .copy-btn { padding: 12px 24px; font-size: 13px; }
        }
        </style>
        """
    
    js = """
    <script>
    function copyMarkdown() {
        fetch(document.location.pathname.replace('.html', '.md'))
            .then(response => response.text())
            .then(text => {
                navigator.clipboard.writeText(text).then(() => {
                    const success = document.querySelector('.copy-success');
                    success.style.display = 'block';
                    setTimeout(() => { success.style.display = 'none'; }, 2500);
                });
            });
    }
    </script>
    """
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    {css}
</head>
<body>
    <button class="copy-btn" onclick="copyMarkdown()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        复制 Markdown
    </button>
    <div class="copy-success">✓ 复制成功！</div>
    
    <div class="article-header">
        <div class="header-decoration"></div>
        <h1>{title}</h1>
        <div class="meta-bar">
            <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                2026-07-16
            </span>
            <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Flutter + Skills
            </span>
            <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                技术教程
            </span>
        </div>
    </div>
    
    <div class="article-container">
        {html_content}
    </div>
    
    <div class="article-footer">
        <p>© 2026 NIHoa · 技术分享</p>
    </div>
    
    {js}
</body>
</html>
"""
    
    output_file = input_file.replace('.md', '.html')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Generated: {output_file}")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python generate_article_preview.py <article.md> --platform wechat|juejin")
        sys.exit(1)
    
    input_file = sys.argv[1]
    platform = 'wechat'
    for arg in sys.argv[2:]:
        if arg.startswith('--platform='):
            platform = arg.split('=')[1]
        elif arg == '--platform':
            platform = sys.argv[sys.argv.index(arg) + 1]
    
    generate_html(input_file, platform)