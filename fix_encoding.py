import os

files = [
    r"src/data/characters.ts",
    r"src/app/factions/[id]/ClientMagazineLayout.tsx",
    r"src/components/MainLobby.tsx",
    r"src/data/scenarioData.ts"
]

def fix_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Determine if it looks garbled (simple heuristic or just attempt fix)
        # The key is to encode to cp949 and decode as utf-8
        try:
            # We assume the current content is what PS wrote as UTF-8, 
            # representing what it thought was the string (read as CP949).
            # So we reverse:
            # content (unicode) -> bytes (cp949) -> string (utf-8)
            raw_bytes = content.encode('cp949')
            restored_content = raw_bytes.decode('utf-8')
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(restored_content)
            print(f"Fixed {path}")
        except Exception as e:
            print(f"Failed to convert {path}: {e}")
            # If cp949 encode fails, maybe it wasn't cp949.
            # Or if utf-8 decode fails, the bytes aren't valid utf-8.

    except Exception as e:
        print(f"Error accessing {path}: {e}")

for f in files:
    fix_file(f)
