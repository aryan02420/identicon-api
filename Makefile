index.html:	README.md Makefile
	pandoc README.md --metadata title="Identicon API | README" --standalone --output index.html
