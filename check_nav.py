import re, os

with open('src/components/Layout.tsx','r',encoding='utf-8') as f:
    layout = f.read()
with open('src/App.tsx','r',encoding='utf-8') as f:
    app = f.read()

nav_paths = set(re.findall(r"path: '([^']+)'", layout))
nav_paths.discard('')
route_paths = set(re.findall(r'path="([^"]+)"', app))

orphans = nav_paths - route_paths
hidden = route_paths - nav_paths

print('Sidebar w/o route:', orphans if orphans else 'NONE')
print('Routes w/o sidebar:', sorted(hidden) if hidden else 'NONE')
