.PHONY:	all build clean almostclean distclean

all:	clean build

build:
	yarn run build

clean:
	rm -fr lib

almostclean:	clean

distclean:	almostclean
	rm -fr node_modules
