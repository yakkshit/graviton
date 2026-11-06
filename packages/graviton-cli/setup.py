from setuptools import setup, find_packages

setup(
    name="graviton-cli",
    version="1.0.0",
    description="The self-hosted, zero-trust AI coding cockpit. Control gravity, not just code.",
    long_description=open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    author="Yakkshit",
    author_email="hello@graviton.dev",
    url="https://github.com/yakkshit/graviton",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Software Development :: Build Tools",
    ],
    python_requires=">=3.8",
    entry_points={
        "console_scripts": [
            "graviton=graviton.cli:main",
        ],
    },
)

