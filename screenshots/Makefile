PNG  := $(wildcard *.png)
WEBP := $(patsubst %.png, %_small.webp, $(PNG))

.PHONY: all
all: $(WEBP)

%_small.webp: %.png
	convert $< -resize 838x $@
