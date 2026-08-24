from PIL import Image

def remove_white_bg(input_path, output_path, tolerance=240):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Check if the pixel is near white
        # item is (R, G, B, A)
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            # Change near-white pixels to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_white_bg("public/bike.webp", "public/bike-transparent.png", tolerance=220)
    print("Background removed successfully.")
